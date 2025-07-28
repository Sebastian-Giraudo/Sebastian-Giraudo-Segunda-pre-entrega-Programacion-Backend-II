// src/controllers/users.controller.js
const bcrypt = require('bcrypt');
const userRepository = require('../repositories/UserRepository');
const { generateToken } = require('../utils/jwt.utils');
const crypto = require('crypto');
const mailService = require('../services/mail.service');
const User = require('../dao/models/user.model');

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
    const { first_name, last_name, email, age, password, role } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios.' });
    }
    try {
        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'El usuario con este correo ya existe.' });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await userRepository.registerUser({
            first_name, last_name, email, age, password: hashedPassword, role: role || 'user'
        });
        res.status(201).json({ status: 'success', message: 'Usuario registrado exitosamente.', user: {
            id: newUser._id,
            first_name: newUser.first_name,
            email: newUser.email,
            role: newUser.role,
            cart: newUser.cart
        }});
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor durante el registro: ' + error.message });
    }
};

// Función para el login de usuarios
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Correo y contraseña son requeridos.' });
    }
    try {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Credenciales inválidas.' });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', message: 'Credenciales inválidas.' });
        }
        const token = generateToken(user);
        res.cookie('coderCookieToken', token, { maxAge: 60 * 60 * 1000, httpOnly: true }).json({ status: 'success', message: 'Login exitoso', token, user: {
            id: user._id,
            first_name: user.first_name,
            email: user.email,
            role: user.role,
            cart: user.cart 
        }});
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor durante el login: ' + error.message });
    }
};

const requestPasswordReset = async (req, res) => {
    
};

const resetPassword = async (req, res) => {
    
};

module.exports = { registerUser, loginUser, requestPasswordReset, resetPassword };