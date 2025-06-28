require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGO_URI,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    port: process.env.PORT || 8080
};