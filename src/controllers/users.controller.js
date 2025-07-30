// src/controllers/users.controller.js
const UserRepository = require('../repositories/UserRepository');
const MailService = require('../services/mail.service');
const { createHash, isValidPassword } = require('../utils/utils');
const crypto = require('crypto'); 

class UsersController {
    constructor() {
        this.userRepository = new UserRepository();
        this.mailService = MailService;
    }

    async registerUser(req, res) {
        try {
            const { first_name, last_name, email, age, password } = req.body;

            if (!first_name || !last_name || !email || !age || !password) {
                return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios.' });
            }

            const existingUser = await this.userRepository.findUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({ status: 'error', message: 'El usuario con este correo ya existe.' });
            }

            const hashedPassword = createHash(password);
            const newUser = await this.userRepository.registerUser({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword,
            });

            res.status(201).json({ status: 'success', message: 'Usuario registrado exitosamente.', user: newUser });
        } catch (error) {
            console.error("Error en UsersController al registrar usuario:", error);
            res.status(500).json({ status: 'error', message: 'Error interno del servidor durante el registro: ' + error.message });
        }
    }

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ status: 'error', message: 'Correo y contraseña son requeridos.' });
            }

            const user = await this.userRepository.findUserByEmail(email);
            if (!user || !isValidPassword(user, password)) {
                return res.status(401).json({ status: 'error', message: 'Credenciales inválidas.' });
            }

            
            res.status(200).json({ status: 'success', message: 'Login exitoso', user: user }); 
        } catch (error) {
            console.error("Error en UsersController al iniciar sesión:", error);
            res.status(500).json({ status: 'error', message: 'Error interno del servidor durante el login: ' + error.message });
        }
    }

    
    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ status: 'error', message: 'El correo electrónico es obligatorio.' });
            }

            const user = await this.userRepository.findUserByEmail(email);
            if (!user) {
                
                return res.status(200).json({ status: 'success', message: 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.' });
            }

            // Generar un token único
            const resetToken = crypto.randomBytes(32).toString('hex');
            
            const resetExpires = Date.now() + 3600000; 

            await this.userRepository.setResetPasswordToken(user._id, resetToken, resetExpires);
            await this.mailService.sendPasswordResetEmail(user.email, resetToken);

            res.status(200).json({ status: 'success', message: 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.' });
        } catch (error) {
            console.error("Error en UsersController al solicitar restablecimiento de contraseña:", error);
            res.status(500).json({ status: 'error', message: 'Error interno del servidor al solicitar el restablecimiento de contraseña: ' + error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { token } = req.query;
            const { newPassword } = req.body;

            if (!token || !newPassword) {
                return res.status(400).json({ status: 'error', message: 'El token y la nueva contraseña son obligatorios.' });
            }

            // Buscar usuario por el token y verificar que no esté expirado
            const user = await this.userRepository.userDAO.findByEmail({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({ status: 'error', message: 'El token de restablecimiento es inválido o ha expirado.' });
            }

            // Verificar que la nueva contraseña no sea igual a la actual
            if (isValidPassword(user, newPassword)) {
                return res.status(400).json({ status: 'error', message: 'La nueva contraseña no puede ser igual a la contraseña actual.' });
            }

            // Hashear la nueva contraseña
            const hashedNewPassword = createHash(newPassword);

            // Actualizar la contraseña y limpiar el token
            await this.userRepository.updateUserPassword(user._id, hashedNewPassword);
            await this.userRepository.clearResetPasswordToken(user._id);

            res.status(200).json({ status: 'success', message: 'Contraseña restablecida exitosamente.' });
        } catch (error) {
            console.error("Error en UsersController al restablecer contraseña:", error);
            res.status(500).json({ status: 'error', message: 'Error interno del servidor al restablecer la contraseña: ' + error.message });
        }
    }
}

module.exports = UsersController;