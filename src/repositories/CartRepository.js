// src/repositories/CartRepository.js
const CartDAO = require('../dao/mongo/CartDAO'); 

class CartRepository {
    constructor(cartDAO) {
        this.cartDAO = cartDAO;
    }
    
    async getPopulatedCart(cartId) {
        try {
            console.log("CartRepository: getPopulatedCart - Intentando obtener carrito con ID:", cartId);
            const cart = await this.cartDAO.getPopulatedCart(cartId);
            console.log("CartRepository: getPopulatedCart - Resultado:", cart ? "Carrito encontrado" : "Carrito NO encontrado");
            return cart;
        } catch (error) {
            console.error("Error en CartRepository.getPopulatedCart:", error);
            throw new Error("No se pudo completar el carrito en el repositorio: " + error.message);
        }
    }
}

module.exports = CartRepository;