// src/dao/mongo/ProductDAO.js
const Product = require('../models/product.model');
class ProductDAO {
    async getById(productId) {
        try {
            const product = await Product.findById(productId);
            return product;
        } catch (error) {            

            throw new Error("No se pudo obtener el producto por ID en DAO: " + error.message);
        }
    }

    async updateStock(productId, newStock) {
        try {
            const product = await Product.findByIdAndUpdate(productId, { stock: newStock }, { new: true });
            if (!product) {
                throw new Error('Producto no encontrado para actualización de stock.');
            }
            return product;
        } catch (error) {            

            throw new Error("No se pudo actualizar el stock del producto en DAO: " + error.message);
        }
    }

    // Métodos CRUD básicos para Product
    async create(productData) {
        try {
            const newProduct = await Product.create(productData);
            return newProduct;
        } catch (error) {            

            throw new Error("No se pudo crear el producto en DAO: " + error.message);
        }
    }

    async update(productId, productData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
            if (!updatedProduct) {
                throw new Error('Producto no encontrado para actualización.');
            }
            return updatedProduct;
        } catch (error) {            

            throw new Error("No se pudo actualizar el producto en DAO: " + error.message);
        }
    }

    async delete(productId) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(productId);
            if (!deletedProduct) {
                throw new Error('Producto no encontrado para eliminar.');
            }
            return deletedProduct;
        } catch (error) {
            
            throw new Error("No se pudo eliminar el producto en DAO: " + error.message);
        }
    }

    async getAll() {
        try {
            const products = await Product.find({});
            return products;
        } catch (error) {            
            throw new Error("No se pudieron obtener todos los productos en DAO: " + error.message);
        }
    }
}

module.exports = ProductDAO;