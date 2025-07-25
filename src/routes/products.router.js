// src/routes/products.router.js
const express = require('express');
const router = express.Router();
const passport = require('passport'); // Necesario para la autenticación
const authorization = require('../middlewares/authorization.middleware'); // Importamos el middleware
const ProductRepository = require('../repositories/ProductRepository'); // <-- Importar ProductRepository
const ProductDAO = require('../dao/mongo/ProductDAO'); // <-- Importar ProductDAO (para instanciar el repo)

// Instanciar el ProductRepository (si no lo haces globalmente)
const productRepository = new ProductRepository(new ProductDAO()); // <-- Instanciar el repo

// Ruta para OBTENER todos los productos (accesible por cualquiera)
router.get('/', async (req, res) => { // <-- Añadimos 'async'
    try {
        const products = await productRepository.getAllProducts(); // <-- Usamos el repo para obtener todos
        res.status(200).json({ status: 'success', products }); // <-- Enviamos JSON
    } catch (error) {
        console.error("Error getting all products:", error);
        res.status(500).json({ status: 'error', message: 'Could not retrieve products: ' + error.message });
    }
});

// Ruta para CREAR un producto (Solo ADMIN)
router.post('/', 
    passport.authenticate('current', { session: false }), 
    authorization(['admin']), 
    async (req, res) => { // <-- Añadimos 'async' y aquí deberías guardar el producto real
        try {
            const newProductData = req.body; // Los datos del producto vienen en el body
            const newProduct = await productRepository.createProduct(newProductData); // <-- Usamos el repo para crear
            res.status(201).json({ status: 'success', message: 'Producto creado por ADMIN', product: newProduct }); // <-- Enviamos JSON
        } catch (error) {
            console.error("Error creating product:", error);
            res.status(500).json({ status: 'error', message: 'Could not create product: ' + error.message });
        }
    }
);

// Ruta para ACTUALIZAR un producto (Solo ADMIN)
router.put('/:pid', 
    passport.authenticate('current', { session: false }), 
    authorization(['admin']), 
    async (req, res) => { // <-- Añadimos 'async'
        try {
            const { pid } = req.params;
            const productDataToUpdate = req.body;
            const updatedProduct = await productRepository.updateProduct(pid, productDataToUpdate);
            res.status(200).json({ status: 'success', message: 'Producto actualizado por ADMIN', product: updatedProduct });
        } catch (error) {
            console.error("Error updating product:", error);
            res.status(500).json({ status: 'error', message: 'Could not update product: ' + error.message });
        }
    }
);

// Ruta para ELIMINAR un producto (Solo ADMIN)
router.delete('/:pid', 
    passport.authenticate('current', { session: false }), 
    authorization(['admin']), 
    async (req, res) => { // <-- Añadimos 'async'
        try {
            const { pid } = req.params;
            const deletedProduct = await productRepository.deleteProduct(pid);
            res.status(200).json({ status: 'success', message: 'Producto eliminado por ADMIN', product: deletedProduct });
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ status: 'error', message: 'Could not delete product: ' + error.message });
        }
    }
);

module.exports = router;