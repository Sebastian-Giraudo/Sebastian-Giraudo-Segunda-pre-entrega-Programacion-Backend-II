// src/utils/utils.js
const bcrypt = require('bcrypt');

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const isValidPassword = (user, password) => {
    // user.password es la contraseña hasheada almacenada en la DB
    // password es la contraseña en texto plano ingresada por el usuario
    return bcrypt.compareSync(password, user.password);
};

module.exports = {
    createHash,
    isValidPassword
};