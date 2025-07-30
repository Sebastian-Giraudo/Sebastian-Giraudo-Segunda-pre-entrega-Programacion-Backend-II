// src/repositories/ProductRepository.js
const ProductDAO = require('../dao/mongo/ProductDAO'); 

class ProductRepository {
    
    constructor() {
        this.dao = new ProductDAO();
    }

    async getProductById(productId) {        
        return await this.dao.getById(productId);
    }

    async updateProductStock(productId, newStock) {        
        return await this.dao.updateStock(productId, newStock);
    }

    async createProduct(productData) {
        return await this.dao.create(productData);
    }

    async updateProduct(productId, productData) {
        return await this.dao.update(productId, productData);
    }

    async deleteProduct(productId) {
        return await this.dao.delete(productId);
    }

    async getAllProducts() {        
        return await this.dao.getAll();
    }
}

module.exports = ProductRepository;