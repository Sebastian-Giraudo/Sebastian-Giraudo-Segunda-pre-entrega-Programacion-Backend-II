// src/routes/users.router.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// Ruta para registrar un nuevo usuario
router.post('/register', usersController.registerUser);

module.exports = router;