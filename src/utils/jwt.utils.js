const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (user) => {
    // No incluimos la contraseña en el token

    // *** AGREGAR ESTE CONSOLE.LOG AQUÍ ***
    console.log("JWT_UTILS: User object received by generateToken:", user);

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        cart: user.cart 
    };
    
    console.log("JWT_UTILS: Payload being signed:", payload); // <--- AÑADE ESTE CONSOLE.LOG
    console.log("Using JWT_PRIVATE_KEY for signing:", config.jwtPrivateKey); // <--- AÑADE ESTA LÍNEA TEMPORALMENTE

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