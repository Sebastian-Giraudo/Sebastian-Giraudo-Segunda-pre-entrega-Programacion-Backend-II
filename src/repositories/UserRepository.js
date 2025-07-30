// src/repositories/UserRepository.js

const UserDAO = require('../dao/mongo/UserDAO');
const CartDAO = require('../dao/mongo/CartDAO');

const userDAO = new UserDAO();
const cartDAO = new CartDAO();

class UserRepository {
    
    constructor(_userDAO = userDAO, _cartDAO = cartDAO) { 
        this.userDAO = _userDAO;
        this.cartDAO = _cartDAO;
    }

    async registerUser(userData) {
        try {
            // 1. Crear un carrito para el nuevo usuario
            const newCart = await this.cartDAO.create({});
            
            const dataToCreateUser = {
                ...userData, // Copia todas las propiedades existentes
                cart: newCart._id // Asegura que el cart ID esté presente y sea un ObjectId
            };

            // 2. Crear el usuario usando el UserDAO con los datos que incluyen el carrito
            const newUser = await this.userDAO.createUser(dataToCreateUser);
            return newUser;
        } catch (error) {            
            throw new Error("No se pudo registrar el usuario: " + error.message);
        }
    }

    async findUserByEmail(email) {
        try {
            return await this.userDAO.findByEmail(email);
        } catch (error) {            
            throw new Error("No se pudo encontrar el usuario por email: " + error.message);
        }
    }

    async findUserById(id) {
        try {
            return await this.userDAO.findById(id);
        } catch (error) {            
            throw new Error("No se pudo encontrar el usuario por ID: " + error.message);
        }
    }

    // Método para actualizar un usuario
    async updateUser(id, dataToUpdate) {
        try {
            return await this.userDAO.update(id, dataToUpdate);
        } catch (error) {            
            throw new Error("No se pudo actualizar el usuario: " + error.message);
        }
    }

    // Método para establecer el token de restablecimiento de contraseña
    async setResetPasswordToken(userId, token, expires) {
        try {
            return await this.userDAO.update(userId, {
                resetPasswordToken: token,
                resetPasswordExpires: expires
            });
        } catch (error) {
            console.error("UserRepository: Error al establecer token de restablecimiento:", error);
            throw new Error("No se pudo establecer el token de restablecimiento de contraseña: " + error.message);
        }
    }

    // Método para limpiar el token de restablecimiento de contraseña
    async clearResetPasswordToken(userId) {
        try {
            return await this.userDAO.update(userId, {
                resetPasswordToken: undefined, 
                resetPasswordExpires: undefined
            });
        } catch (error) {            
            throw new Error("No se pudo limpiar el token de restablecimiento de contraseña: " + error.message);
        }
    }

    // Método para actualizar solo la contraseña del usuario
    async updateUserPassword(userId, newHashedPassword) {
        try {
            return await this.userDAO.update(userId, { password: newHashedPassword });
        } catch (error) {            
            throw new Error("No se pudo actualizar la contraseña del usuario: " + error.message);
        }
    }
}

module.exports = UserRepository;