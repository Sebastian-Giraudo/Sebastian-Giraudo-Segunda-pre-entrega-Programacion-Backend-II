const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (user) => {
    // No incluimos la contraseña en el token
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        cart: user.cart 
    };
    const token = jwt.sign(payload, config.jwtPrivateKey, { expiresIn: '1h' }); // Token expira en 1 hora
    return token;
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.jwtPrivateKey);
        return decoded;
    } catch (error) {
        // Manejar errores de token (expirado, inválido, etc.)
        console.error("Error verifying token:", error);
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};