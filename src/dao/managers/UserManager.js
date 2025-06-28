const User = require('../models/user.model');
const Cart = require('../models/cart.model'); 

class UserManager {
    async createUser(userData) {
        try {
            // Antes de crear el usuario, creamos un carrito para él
            const newCart = await Cart.create({});
            userData.cart = newCart._id; // Asignamos el ID del carrito al usuario

            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Could not create user: " + error.message);
        }
    }

    async findByEmail(email) {
        try {
            const user = await User.findOne({ email }).populate('cart');
            return user;
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw new Error("Could not find user by email: " + error.message);
        }
    }

    async findById(id) {
        try {
            const user = await User.findById(id).populate('cart');
            return user;
        } catch (error) {
            console.error("Error finding user by ID:", error);
            throw new Error("Could not find user by ID: " + error.message);
        }
    }
    
}

module.exports = UserManager;