// src/dao/models/ticket.model.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        default: () => Math.random().toString(36).substring(2, 10).toUpperCase() + Date.now().toString(36)
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String, 
        required: true
    },
    products: [ 
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products', 
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

const TicketModel = mongoose.model('tickets', ticketSchema);

module.exports = TicketModel;