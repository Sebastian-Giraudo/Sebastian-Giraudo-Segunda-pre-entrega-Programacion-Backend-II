// src/routes/products.router.js
const express = require('express');
const router = express.Router();
const passport = require('passport'); 
const authorization = require('../middlewares/authorization.middleware');
const ProductRepository = require('../repositories/ProductRepository'); 
const ProductDAO = require('../dao/mongo/ProductDAO'); 

// Instanciar el ProductRepository (si no lo haces globalmente)
const productRepository = new ProductRepository(new ProductDAO());

// Ruta para OBTENER todos los productos (accesible por cualquiera)
router.get('/', async (req, res) => {
    try {
        const products = await productRepository.getAllProducts(); 
        res.status(200).json({ status: 'success', products }); 
    } catch (error) {
        console.error("Error al obtener todos los productos:", error);
        res.status(500).json({ status: 'error', message: 'No se pudieron recuperar los productos: ' + error.message });
    }
});

// Ruta para CREAR un producto (Solo ADMIN)
router.post('/', 
    passport.authenticate('current', { session: false }), 
    authorization(['admin']), 
    async (req, res) => { 
        try {
            const newProductData = req.body; 
            const newProduct = await productRepository.createProduct(newProductData); 
            res.status(201).json({ status: 'success', message: 'Producto creado por ADMIN', product: newProduct }); 

        } catch (error) {
            console.error("Error al crear el producto:", error);
            res.status(500).json({ status: 'error', message: 'No se pudo crear el producto: ' + error.message });
        }
    }
);

// Ruta para ACTUALIZAR un producto (Solo ADMIN)
router.put('/:pid', 
    passport.authenticate('current', { session: false }), 
    authorization(['admin']), 
    async (req, res) => { 
        try {
            const { pid } = req.params;
            const productDataToUpdate = req.body;
            const updatedProduct = await productRepository.updateProduct(pid, productDataToUpdate);
            res.status(200).json({ status: 'success', message: 'Producto actualizado por ADMIN', product: updatedProduct });
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            res.status(500).json({ status: 'error', message: 'No se pudo actualizar el producto: ' + error.message });
        }
    }
);

// Ruta para ELIMINAR un producto (Solo ADMIN)
router.delete('/:pid', 
    passport.authenticate('current', { session: false }), 
    authorization(['admin']), 
    async (req, res) => { 
        try {
            const { pid } = req.params;
            const deletedProduct = await productRepository.deleteProduct(pid);
            res.status(200).json({ status: 'success', message: 'Producto eliminado por ADMIN', product: deletedProduct });
        } catch (error) {
            console.error("Error al borrar producto:", error);
            res.status(500).json({ status: 'error', message: 'No se pudo borrar el producto: ' + error.message });
        }
    }
);

module.exports = router;