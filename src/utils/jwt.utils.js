// src/utils/jwt.utils.js
const config = require('../config/config');

const generateToken = (user) => {  
    
    console.log("JWT_UTILS: Objeto de user recibido por generateToken:", user);

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        cart: user.cart 
    };
    
    console.log("JWT_UTILS: Carga útil confirmada:", payload);
    console.log("Uso de JWT_PRIVATE_KEY para confirmar:", config.jwtPrivateKey); 

    const token = jwt.sign(payload, config.jwtPrivateKey, { expiresIn: '1h' }); 
    return token;
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.jwtPrivateKey);
        return decoded;
    } catch (error) {
        // Manejar errores de token (expirado, inválido, etc.)
        console.error("Error de verificación de token:", error);
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};