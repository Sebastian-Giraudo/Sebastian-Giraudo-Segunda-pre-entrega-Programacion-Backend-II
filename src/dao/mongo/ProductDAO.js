// src/dao/mongo/ProductDAO.js
const Product = require('../models/Product'); // RUTA CORREGIDA: Importa el modelo de Producto desde src/dao/models/Product.js

class ProductDAO {
    async getById(productId) {
        try {
            const product = await Product.findById(productId);
            return product;
        } catch (error) {
            console.error("Error getting product by ID in DAO:", error);
            throw new Error("Could not get product by ID in DAO: " + error.message);
        }
    }

    async updateStock(productId, newStock) {
        try {
            const product = await Product.findByIdAndUpdate(productId, { stock: newStock }, { new: true });
            if (!product) {
                throw new Error('Product not found for stock update.');
            }
            return product;
        } catch (error) {
            console.error("Error updating product stock in DAO:", error);
            throw new Error("Could not update product stock in DAO: " + error.message);
        }
    }

    // Métodos CRUD básicos para Product (puedes expandir según tu ProductController)
    async create(productData) {
        try {
            const newProduct = await Product.create(productData);
            return newProduct;
        } catch (error) {
            console.error("Error creating product in DAO:", error);
            throw new Error("Could not create product in DAO: " + error.message);
        }
    }

    async update(productId, productData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
            if (!updatedProduct) {
                throw new Error('Product not found for update.');
            }
            return updatedProduct;
        } catch (error) {
            console.error("Error updating product in DAO:", error);
            throw new Error("Could not update product in DAO: " + error.message);
        }
    }

    async delete(productId) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(productId);
            if (!deletedProduct) {
                throw new Error('Product not found for deletion.');
            }
            return deletedProduct;
        } catch (error) {
            console.error("Error deleting product in DAO:", error);
            throw new Error("Could not delete product in DAO: " + error.message);
        }
    }

    async getAll() {
        try {
            const products = await Product.find({});
            return products;
        } catch (error) {
            console.error("Error getting all products in DAO:", error);
            throw new Error("Could not get all products in DAO: " + error.message);
        }
    }
}

module.exports = ProductDAO;