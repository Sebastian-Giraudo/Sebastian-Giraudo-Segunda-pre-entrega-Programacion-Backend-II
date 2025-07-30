// src/services/mail.service.js
const nodemailer = require('nodemailer');
const config = require('../config/config');

// Configuración del transporter de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailUser, // Email de envío (desde .env)
        pass: config.emailPass  // Contraseña de aplicación (desde .env)
    }
});

const sendPasswordResetEmail = async (to, token) => {
    const resetLink = `http://localhost:${config.port}/reset-password?token=${token}`; 

    const mailOptions = {
        from: config.emailUser,
        to: to,
        subject: 'Restablecer contraseña - E-commerce',
        html: `
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente enlace para continuar:</p>
            <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Restablecer Contraseña</a>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no solicitaste un restablecimiento de contraseña, ignora este correo.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);        
    } catch (error) {        
        throw new Error('No se pudo enviar el email de restablecimiento de contraseña.');
    }
};

module.exports = {
    sendPasswordResetEmail
};