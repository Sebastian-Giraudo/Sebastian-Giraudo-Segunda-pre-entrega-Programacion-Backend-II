const bcrypt = require('bcrypt');
const userRepository = require('../repositories/UserRepository');
const { generateToken } = require('../utils/jwt.utils');
const crypto = require('crypto');
const mailService = require('../services/mail.service');
const User = require('../dao/models/user.model');

const registerUser = async (req, res) => {
    const { first_name, last_name, email, age, password, role } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({ status: 'error', message: 'All fields are required.' });
    }
    try {
        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'User with this email already exists.' });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await userRepository.registerUser({
            first_name, last_name, email, age, password: hashedPassword, role: role || 'user'
        });
        res.status(201).json({ status: 'success', message: 'User registered successfully', user: {
            id: newUser._id,
            first_name: newUser.first_name,
            email: newUser.email,
            role: newUser.role,
            cart: newUser.cart // Asegúrate de que el ID del carrito esté aquí
        }});
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ status: 'error', message: 'Internal server error during registration: ' + error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
    }
    try {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });
        }
        const token = generateToken(user);
        res.cookie('coderCookieToken', token, { maxAge: 60 * 60 * 1000, httpOnly: true }).json({ status: 'success', message: 'Login successful', token, user: {
            id: user._id,
            first_name: user.first_name,
            email: user.email,
            role: user.role,
            cart: user.cart // Asegúrate de que el ID del carrito esté aquí
        }});
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ status: 'error', message: 'Internal server error during login: ' + error.message });
    }
};

const requestPasswordReset = async (req, res) => {
    // ... (tu código actual) ...
};

const resetPassword = async (req, res) => {
    // ... (tu código actual) ...
};

module.exports = { registerUser, loginUser, requestPasswordReset, resetPassword };