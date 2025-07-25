// src/controllers/carts.controller.js
const CartRepository = require('../repositories/CartRepository');
const ProductRepository = require('../repositories/ProductRepository');
const Ticket = require('../dao/models/Ticket'); // RUTA CORREGIDA: Importa el modelo de Ticket desde src/dao/models/Ticket.js
const { v4: uuidv4 } = require('uuid'); // Para generar códigos únicos para los tickets

// Importar los DAOs para pasarlos a los repositorios
const CartDAO = require('../dao/mongo/CartDAO');
const ProductDAO = require('../dao/mongo/ProductDAO'); // Importa el ProductDAO desde src/dao/mongo/ProductDAO.js

// Instanciamos los repositorios con sus respectivos DAOs
const cartRepository = new CartRepository(new CartDAO());
const productRepository = new ProductRepository(new ProductDAO()); 

class CartController { // Aquí definimos la clase CartController
    // Método para agregar un producto al carrito
    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body; // Asume que la cantidad viene en el body, si no, por defecto 1

            if (!quantity || quantity <= 0) {
                return res.status(400).json({ status: 'error', message: 'Quantity must be a positive number.' });
            }

            const product = await productRepository.getProductById(pid);
            if (!product) {
                return res.status(404).json({ status: 'error', message: 'Product not found.' });
            }

            if (product.stock < quantity) {
                return res.status(400).json({ status: 'error', message: `Not enough stock for product ${product.name}. Available: ${product.stock}` });
            }

            const updatedCart = await cartRepository.addProductToCart(cid, pid, quantity);
            res.status(200).json({ status: 'success', message: 'Product added to cart successfully.', cart: updatedCart });
        } catch (error) {
            console.error("Error adding product to cart:", error);
            res.status(500).json({ status: 'error', message: 'Could not add product to cart: ' + error.message });
        }
    }

    // Método para ver un carrito
    async getCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartRepository.getPopulatedCart(cid); // Obtener carrito con productos populados
            if (!cart) {
                return res.status(404).json({ status: 'error', message: 'Cart not found.' });
            }
            res.status(200).json({ status: 'success', cart });
        } catch (error) {
            console.error("Error getting cart:", error);
            res.status(500).json({ status: 'error', message: 'Could not retrieve cart: ' + error.message });
        }
    }

    // Método para finalizar la compra y generar un ticket
    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const purchaserEmail = req.user.email; // El email del usuario logueado viene de req.user (Passport)

            const cart = await cartRepository.getPopulatedCart(cid);
            if (!cart) {
                return res.status(404).json({ status: 'error', message: 'Cart not found.' });
            }

            if (cart.products.length === 0) {
                return res.status(400).json({ status: 'error', message: 'Cannot purchase an empty cart.' });
            }

            let productsToPurchase = [];
            let productsNotPurchased = [];
            let totalAmount = 0;

            // 1. Verificar stock y procesar productos
            for (const item of cart.products) {
                // Asegúrate de que item.product es el objeto populado, no solo el ID
                const productDb = item.product; // Ya populado por getPopulatedCart

                // Si el producto no se populó correctamente o no existe, o si no tiene stock
                if (!productDb || !productDb._id || typeof productDb.stock === 'undefined') {
                    productsNotPurchased.push({ product: item.product._id || item.product, quantity: item.quantity, reason: 'Product data missing or not found.' });
                    continue;
                }

                if (productDb.stock >= item.quantity) {
                    // Suficiente stock: añadir a la lista de compra
                    productsToPurchase.push({
                        product: productDb._id,
                        quantity: item.quantity,
                        price: productDb.price // Usar el precio actual del producto
                    });
                    totalAmount += productDb.price * item.quantity;

                    // Descontar stock (en memoria para el cálculo y luego se actualiza en DB)
                    productDb.stock -= item.quantity; 
                } else {
                    // No hay suficiente stock: añadir a la lista de no comprados
                    productsNotPurchased.push({ product: productDb._id, quantity: item.quantity, reason: `Not enough stock. Available: ${productDb.stock}` });
                }
            }

            // Si no hay productos para comprar, no se genera ticket
            if (productsToPurchase.length === 0) {
                return res.status(400).json({ status: 'error', message: 'No products could be purchased due to insufficient stock.', productsNotPurchased });
            }

            // 2. Generar Ticket
            const newTicket = await Ticket.create({
                code: uuidv4(), // Genera un UUID único para el código
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: purchaserEmail,
                products: productsToPurchase
            });

            // 3. Actualizar stock en la base de datos para los productos comprados
            for (const item of productsToPurchase) {
                // Obtener el producto de nuevo para la actualización y asegurar el stock más reciente
                const currentProduct = await productRepository.getProductById(item.product); 
                if (currentProduct) {
                    // Restar la cantidad comprada al stock actual del producto en la DB
                    await productRepository.updateProductStock(item.product, currentProduct.stock - item.quantity);
                }
            }

            // 4. Actualizar el carrito: remover los productos comprados
            // Filtra los productos que NO fueron comprados para mantenerlos en el carrito
            cart.products = cart.products.filter(cartItem => 
                productsNotPurchased.some(notPurchasedItem => notPurchasedItem.product.equals(cartItem.product._id))
            );
            await cart.save(); // Guarda el carrito con los productos restantes


            res.status(200).json({ 
                status: 'success', 
                message: 'Purchase completed successfully!', 
                ticket: newTicket, 
                productsNotPurchased 
            });

        } catch (error) {
            console.error("Error during cart purchase:", error);
            res.status(500).json({ status: 'error', message: 'Could not complete purchase: ' + error.message });
        }
    }
}

module.exports = CartController;
