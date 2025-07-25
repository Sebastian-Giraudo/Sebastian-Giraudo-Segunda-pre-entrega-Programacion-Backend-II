// src/repositories/ProductRepository.js
const ProductDAO = require('../dao/mongo/ProductDAO'); // Importa tu ProductDAO

class ProductRepository {
    constructor(productDAO) {
        this.productDAO = productDAO;
    }

    async getProductById(productId) {
        return await this.productDAO.getById(productId);
    }

    async updateProductStock(productId, newStock) {
        return await this.productDAO.updateStock(productId, newStock);
    }

    // Puedes añadir más métodos CRUD aquí si tu ProductController los necesita
    async createProduct(productData) {
        return await this.productDAO.create(productData);
    }

    async updateProduct(productId, productData) {
        return await this.productDAO.update(productId, productData);
    }

    async deleteProduct(productId) {
        return await this.productDAO.delete(productId);
    }

    async getAllProducts() {
        return await this.productDAO.getAll();
    }
}

module.exports = ProductRepository;