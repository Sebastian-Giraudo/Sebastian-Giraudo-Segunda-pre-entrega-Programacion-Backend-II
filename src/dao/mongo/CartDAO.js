// src/dao/mongo/CartDAO.js
const Cart = require('../models/cart.model'); 
const Product = require('../models/Product'); 

class CartDAO {
    

    // Método para obtener el carrito con los detalles completos de los productos (populados)
    async getPopulatedCart(cartId) {
        try {

            console.log("CartDAO: getPopulatedCart - Buscando carrito con ID:", cartId);
            // Popula los productos dentro del carrito para obtener sus detalles completos
            const cart = await Cart.findById(cartId).populate('products.product');
            console.log("CartDAO: getPopulatedCart - Carrito de la DB:", cart); 

            return cart;
        } catch (error) {
            console.error("CartDAO: Error getting populated cart in DAO:", error);
            throw new Error("No se pudo completar el carrito en DAO: " + error.message);
        }
    }
}

module.exports = CartDAO;

