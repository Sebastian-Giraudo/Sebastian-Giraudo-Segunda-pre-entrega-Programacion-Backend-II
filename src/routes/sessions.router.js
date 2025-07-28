// src/routes/sessions.router.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users.controller');
const UserDTO = require('../dto/user.dto');

router.post('/register', passport.authenticate('register', { session: false, failureRedirect: '/failregister' }), (req, res) => {
    // Si el registro es exitoso, Passport pondrá el usuario en req.user
    res.status(201).json({ status: 'success', message: 'Usuario registrado exitósamente!', user: req.user });
});

// Ruta para el login de usuarios
router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Acceso correcto',
        user: req.user.user,
        token: req.user.token
    });
});

// Ruta para solicitar un restablecimiento de contraseña
router.post('/forgot-password', usersController.requestPasswordReset);

// Ruta para restablecer la contraseña (cuando el usuario envía la nueva contraseña)
router.post('/reset-password', usersController.resetPassword);

// Ruta para validar el usuario logueado y devolver sus datos
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    const currentUser = req.user;
    const userDto = new UserDTO(currentUser);
    res.status(200).json({ status: 'success', user: userDto });
});

// Ruta para logout
router.post('/logout', (req, res) => {
    res.clearCookie('coderCookieToken');
    res.status(200).json({ status: 'success', message: 'Cierre exitoso.' });
});

module.exports = router;