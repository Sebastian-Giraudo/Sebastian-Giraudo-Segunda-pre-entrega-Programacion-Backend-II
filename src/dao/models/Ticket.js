// src/models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    // Código único del ticket (puede ser un UUID o un hash generado)
    code: {
        type: String,
        unique: true,
        required: true
    },
    // Fecha y hora de la compra
    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true
    },
    // Monto total de la compra
    amount: {
        type: Number,
        required: true
        // Se calculará sumando el precio * cantidad de cada producto comprado
    },
    // Email del comprador
    purchaser: {
        type: String,
        required: true
    },
    // Productos comprados en este ticket
    products: [
        {
            // Referencia al ID del producto
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // El 'ref' siempre apunta al nombre del modelo, no a la ruta del archivo
                required: true
            },
            // Cantidad comprada de ese producto
            quantity: {
                type: Number,
                required: true
            },
            // Precio unitario al momento de la compra (para evitar cambios de precio futuros)
            price: {
                type: Number,
                required: true
            }
        }
    ]
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;