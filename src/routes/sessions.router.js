const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users.controller');

// Ruta para el login de usuarios
router.post('/login', usersController.loginUser);

// Ruta para validar el usuario logueado y devolver sus datos
// Usamos la estrategia 'current' que configuramos en passport.config.js
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    
    res.status(200).json({ status: 'success', user: req.user });
});

// Ruta para logout 
router.post('/logout', (req, res) => {
    res.clearCookie('coderCookieToken'); // Borra la cookie del token
    res.status(200).json({ status: 'success', message: 'Logout successful' });
});

module.exports = router;