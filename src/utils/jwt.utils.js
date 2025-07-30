// src/utils/jwt.utils.js
const config = require('../config/config');

const generateToken = (user) => {         

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        cart: user.cart 
    };   
    

    const token = jwt.sign(payload, config.jwtPrivateKey, { expiresIn: '1h' }); 
    return token;
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.jwtPrivateKey);
        return decoded;
    } catch (error) {        
        
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};