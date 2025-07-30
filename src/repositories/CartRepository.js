// src/repositories/CartRepository.js
const CartDAO = require('../dao/mongo/CartDAO');
const ProductDAO = require('../dao/mongo/ProductDAO'); 
const TicketDAO = require('../dao/mongo/TicketDAO');   

class CartRepository {
    constructor() {
        
        this.cartDAO = new CartDAO();
        this.productDAO = new ProductDAO(); 
        this.ticketDAO = new TicketDAO();
    }

    async getPopulatedCart(cartId) {
        try {
            return await this.cartDAO.getPopulatedCart(cartId);
        } catch (error) {
            console.error("CartRepository: Error al obtener carrito populado en repositorio:", error);
            throw new Error("No se pudo obtener el carrito populado: " + error.message);
        }
    }

    // Método para añadir producto al carrito (o actualizar cantidad)
    async addProductToCart(cartId, productId, quantity) {
        try {
            const product = await this.productDAO.getById(productId);
            if (!product) {
                throw new Error(`Producto con ID ${productId} no encontrado.`);
            }
            if (product.stock < quantity) {
                throw new Error(`Stock insuficiente para el producto ${product.title}. Stock disponible: ${product.stock}`);
            }

            return await this.cartDAO.addProduct(cartId, productId, quantity);
        } catch (error) {
            console.error("CartRepository: Error al añadir producto al carrito en repositorio:", error);
            throw new Error("No se pudo añadir producto al carrito: " + error.message);
        }
    }

    // Método para actualizar la lista de productos de un carrito
    async updateCartProducts(cartId, newProductsArray) {
        try {
            return await this.cartDAO.updateProductsInCart(cartId, newProductsArray);
        } catch (error) {
            console.error("CartRepository: Error al actualizar productos del carrito en repositorio:", error);
            throw new Error("No se pudieron actualizar los productos del carrito: " + error.message);
        }
    }

    async purchaseCart(cartId, userEmail) {
        try {
            const cart = await this.cartDAO.getPopulatedCart(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }

            const productsToPurchase = [];
            const productsNotPurchased = [];
            let totalAmount = 0;

            
            if (!Array.isArray(cart.products)) {
                console.warn("CartRepository: cart.products no es un array. Carrito:", cart);
                
                return { ticket: null, productsNotPurchased: [] };
            }

            for (const item of cart.products) {
                
                if (!item.product || !item.product._id) {
                    console.warn("CartRepository: Producto no populado o incompleto en el carrito. Item:", item);
                    productsNotPurchased.push(item); 
                    continue; 
                }

                const product = item.product;
                const quantity = item.quantity;

                if (product.stock >= quantity) {
                    // Suficiente stock, se puede comprar
                    productsToPurchase.push({
                        product: product._id, 
                        quantity: quantity,
                        price: product.price
                    });
                    totalAmount += product.price * quantity;

                    // Actualizar stock del producto
                    await this.productDAO.updateStock(product._id, product.stock - quantity); 
                } else {
                    // Stock insuficiente, el producto no se compra
                    productsNotPurchased.push(item);
                }
            }

            let newTicket = null;
            if (productsToPurchase.length > 0) {
                
                newTicket = await this.ticketDAO.create({ 
                    amount: totalAmount,
                    purchaser: userEmail,
                    products: productsToPurchase 
                });
            }

            
            await this.cartDAO.updateProductsInCart(cartId, productsNotPurchased.map(item => ({
                product: item.product._id, 
                quantity: item.quantity
            })));


            // Devolver el resultado de la operación de compra
            return {
                ticket: newTicket,
                productsNotPurchased: productsNotPurchased.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    reason: 'Stock insuficiente' 
                }))
            };

        } catch (error) {
            console.error("CartRepository: Error al finalizar compra en repositorio:", error);
            
            throw new Error("No se pudo finalizar la compra: " + error.message);
        }
    }
}

module.exports = CartRepository;