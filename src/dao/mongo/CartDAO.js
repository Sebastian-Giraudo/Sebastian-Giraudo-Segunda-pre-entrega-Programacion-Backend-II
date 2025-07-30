// src/dao/mongo/CartDAO.js
const Cart = require('../models/cart.model');
const Product = require('../models/product.model'); 

class CartDAO {
    // Método para crear un nuevo carrito vacío
    async create() {
        try {
            const newCart = await Cart.create({});            
            return newCart;
        } catch (error) {            
            throw new Error("No se pudo crear el carrito en DAO: " + error.message);
        }
    }

    // Método para obtener el carrito con los detalles completos de los productos (populados)
    async getPopulatedCart(cartId) {
        try {            
            const cart = await Cart.findById(cartId).populate('products.product');            
            return cart;
        } catch (error) {            
            throw new Error("No se pudo obtener el carrito populado en DAO: " + error.message);
        }
    }

    // Método para agregar un producto al carrito (o actualizar su cantidad)
    async addProduct(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex !== -1) {
                // Si el producto ya existe en el carrito, actualiza la cantidad
                cart.products[productIndex].quantity += quantity;
            } else {
                // Si el producto no existe, agrégalo
                cart.products.push({ product: productId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {            
            throw new Error("No se pudo añadir producto al carrito en DAO: " + error.message);
        }
    }

    // Método para actualizar la lista completa de productos de un carrito
    async updateProductsInCart(cartId, newProductsArray) {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(
                cartId,
                { products: newProductsArray },
                { new: true } 
            );
            if (!updatedCart) {
                throw new Error('Carrito no encontrado para actualizar productos.');
            }
            return updatedCart;
        } catch (error) {            
            throw new Error("No se pudieron actualizar los productos del carrito en DAO: " + error.message);
        }
    }
}

module.exports = CartDAO;

