// src/repositories/CartRepository.js
const CartDAO = require('../dao/mongo/CartDAO'); 

class CartRepository {
    constructor(cartDAO) {
        this.cartDAO = cartDAO;
    }

    // ... (otros métodos) ...

    async getPopulatedCart(cartId) {
        try {
            console.log("CartRepository: getPopulatedCart - Intentando obtener carrito con ID:", cartId); // <-- AGREGAR LOG
            const cart = await this.cartDAO.getPopulatedCart(cartId);
            console.log("CartRepository: getPopulatedCart - Resultado:", cart ? "Carrito encontrado" : "Carrito NO encontrado"); // <-- AGREGAR LOG
            return cart;
        } catch (error) {
            console.error("Error in CartRepository.getPopulatedCart:", error);
            throw new Error("Could not get populated cart in repository: " + error.message);
        }
    }
}

module.exports = CartRepository;