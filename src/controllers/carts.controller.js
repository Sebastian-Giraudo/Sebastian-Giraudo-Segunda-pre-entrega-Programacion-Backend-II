// src/controllers/carts.controller.js
const CartRepository = require('../repositories/CartRepository');
const ProductRepository = require('../repositories/ProductRepository');
const TicketRepository = require('../repositories/TicketRepository');

class CartController {
    constructor() {        
        this.cartRepository = new CartRepository();
        this.productRepository = new ProductRepository();
        this.ticketRepository = new TicketRepository();        
        this.addProductToCart = this.addProductToCart.bind(this);
        this.getCart = this.getCart.bind(this);
        this.purchaseCart = this.purchaseCart.bind(this);
    }

    async addProductToCart(req, res) {

        try {
            const { cid, pid } = req.params;
            const { quantity = 1 } = req.body;

            if (quantity <= 0) {
                return res.status(400).json({ status: 'error', message: 'La cantidad debe ser un número positivo.' });
            }

            // 1. Verificar que el producto existe
            const product = await this.productRepository.getProductById(pid); 
            if (!product) {
                return res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });
            }

            // 2. Verificar stock del producto
            if (product.stock < quantity) {
                return res.status(400).json({ status: 'error', message: `Stock insuficiente para el producto ${product.name}. Stock disponible: ${product.stock}` });
            }

            // 3. Añadir el producto al carrito (la lógica de update en el repo)
            const updatedCart = await this.cartRepository.addProductToCart(cid, pid, quantity);

            res.status(200).json({ status: 'success', message: 'Producto agregado al carrito exitosamente.', cart: updatedCart });
        } catch (error) {            
            
            if (error.message.includes('Stock insuficiente') || error.message.includes('Producto no encontrado')) {
                return res.status(400).json({ status: 'error', message: error.message });
            }
            res.status(500).json({ status: 'error', message: 'Error interno del servidor al agregar producto al carrito: ' + error.message });
        }
    }

    async getCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await this.cartRepository.getPopulatedCart(cid);

            if (!cart) {
                return res.status(404).json({ status: 'error', message: 'Carrito no encontrado.' });
            }

            res.status(200).json({ status: 'success', cart });
        } catch (error) {            
            res.status(500).json({ status: 'error', message: 'Error interno del servidor al obtener el carrito: ' + error.message });
        }
    }

    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const userEmail = req.user.email; 

            if (!userEmail) {
                return res.status(401).json({ status: 'error', message: 'Usuario no autenticado o email no disponible.' });
            }
            
            const result = await this.cartRepository.purchaseCart(cid, userEmail);

            if (result.ticket) {
                res.status(200).json({
                    status: 'success',
                    message: 'Compra finalizada exitosamente.',
                    ticket: result.ticket,
                    productsNotPurchased: result.productsNotPurchased
                });
            } else {
                res.status(200).json({ 
                    status: 'info',
                    message: 'No se pudieron comprar productos debido a stock insuficiente. El carrito ha sido actualizado con los productos no comprados.',
                    productsNotPurchased: result.productsNotPurchased
                });
            }

        } catch (error) {            
            if (error.message.includes('Carrito no encontrado')) {
                return res.status(404).json({ status: 'error', message: error.message });
            }
            res.status(500).json({ status: 'error', message: 'Error interno del servidor al finalizar la compra: ' + error.message });
        }
    }
}

module.exports = CartController;
