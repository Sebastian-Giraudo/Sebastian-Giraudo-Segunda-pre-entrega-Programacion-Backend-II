// src/dao/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, default: 'no-image.jpg' },
    status: { type: Boolean, default: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;