// src/routes/carts.router.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authorization = require('../middlewares/authorization.middleware');
const CartController = require('../controllers/carts.controller'); // Importar el nuevo controlador de carrito

// Instanciamos el controlador
const cartController = new CartController(); // Se instancia aquí para usar sus métodos

// Ruta para AGREGAR un producto al carrito (Solo USER o PREMIUM)
router.post('/:cid/product/:pid', 
    passport.authenticate('current', { session: false }), 
    authorization(['user', 'premium']), 
    cartController.addProductToCart // Usar el método del controlador
);

// Ruta para ver un carrito (puede ser para user, admin, premium)
router.get('/:cid', 
    passport.authenticate('current', { session: false }), 
    authorization(['user', 'admin', 'premium']), 
    cartController.getCart // Usar el método del controlador
);

// ************************************
// *** NUEVA RUTA: FINALIZAR COMPRA ***
// ************************************
router.post('/:cid/purchase',
    passport.authenticate('current', { session: false }),
    authorization(['user', 'premium']), // Solo usuarios y premium pueden finalizar su compra
    cartController.purchaseCart // Método para finalizar la compra
);

module.exports = router;