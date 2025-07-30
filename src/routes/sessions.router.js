// src/routes/sessions.router.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const UsersController = require('../controllers/users.controller'); 
const UserDTO = require('../dto/user.dto');

const usersController = new UsersController();

router.post('/register', passport.authenticate('register', { session: false, failureRedirect: '/failregister' }), (req, res) => {
    res.status(201).json({ status: 'success', message: 'Usuario registrado exitosamente.', user: req.user });
});

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Inicio de sesión exitoso',
        user: req.user.user,
        token: req.user.token
    });
});

router.post('/forgot-password', usersController.requestPasswordReset);

router.post('/reset-password', usersController.resetPassword);

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    const currentUser = req.user;
    const userDto = new UserDTO(currentUser);
    res.status(200).json({ status: 'success', user: userDto });
});

router.post('/logout', (req, res) => {
    res.clearCookie('coderCookieToken');
    res.status(200).json({ status: 'success', message: 'Sesión cerrada exitosamente.' });
});

module.exports = router;