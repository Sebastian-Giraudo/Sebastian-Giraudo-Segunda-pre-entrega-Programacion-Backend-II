// src/config/config.js
require('dotenv').config();

const config = {
    mongoURI: process.env.MONGO_URI,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    port: process.env.PORT || 8080,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS
};


console.log("JWT_PRIVATE_KEY loaded from .env:", config.jwtPrivateKey);

module.exports = config;