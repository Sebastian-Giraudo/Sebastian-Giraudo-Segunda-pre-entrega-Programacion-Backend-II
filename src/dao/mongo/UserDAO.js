// src/dao/mongo/UserDAO.js
const User = require('../models/user.model');

class UserDAO {
    async createUser(userData) {
        try {
            
            const newUser = await User.create(userData);            
            return newUser;
        } catch (error) {
            
            throw new Error("No se pudo crear el usuario en DAO: " + error.message);
        }
    }

    async findByEmail(email) {
        try {
            
            const user = await User.findOne({ email }).populate('cart');            
            return user;
        } catch (error) {            
            throw new Error("No se pudo encontrar el usuario por email en DAO: " + error.message);
        }
    }

    async findById(id) {
        try {
            
            const user = await User.findById(id).populate('cart');            
            return user;
        } catch (error) {
            
            throw new Error("No se pudo encontrar el usuario por ID en DAO: " + error.message);
        }
    }

    // Método para actualizar un usuario por su ID
    async update(id, dataToUpdate) {
        try {
            const updatedUser = await User.findByIdAndUpdate(id, dataToUpdate, { new: true });
            if (!updatedUser) {
                throw new Error('Usuario no encontrado para actualizar.');
            }
            return updatedUser;
        } catch (error) {            
            throw new Error("No se pudo actualizar el usuario en DAO: " + error.message);
        }
    }
}

module.exports = UserDAO;