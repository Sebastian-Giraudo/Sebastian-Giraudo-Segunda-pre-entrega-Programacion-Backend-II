const User = require('../models/user.model');

class UserDAO {
    async createUser(userData) {
        try {
            console.log("UserDAO: Intentando crear usuario con datos (antes de Mongoose.create):", userData); // <--- NUEVO LOG
            const newUser = await User.create(userData);
            console.log("UserDAO: Usuario creado exitosamente (con datos de Mongoose):", newUser); // <--- LOG EXISTENTE
            return newUser;
        } catch (error) {
            console.error("UserDAO: Error al crear usuario en DAO:", error);
            throw new Error("No se pudo crear el usuario en DAO: " + error.message);
        }
    }

    async findByEmail(email) {
        try {
            console.log("UserDAO: Buscando usuario por email:", email);
            const user = await User.findOne({ email }).populate('cart');
            console.log("UserDAO: Usuario encontrado por email:", user ? user.email : "No encontrado", "Carrito:", user ? user.cart : "N/A");
            return user;
        } catch (error) {
            console.error("UserDAO: Error al buscar usuario por email en DAO:", error);
            throw new Error("No se pudo encontrar el usuario por email en DAO: " + error.message);
        }
    }

    async findById(id) {
        try {
            console.log("UserDAO: Buscando usuario por ID:", id);
            const user = await User.findById(id).populate('cart');
            console.log("UserDAO: Usuario encontrado por ID:", user ? user.email : "No encontrado", "Carrito:", user ? user.cart : "N/A");
            return user;
        } catch (error) {
            console.error("UserDAO: Error al buscar usuario por ID en DAO:", error);
            throw new Error("No se pudo encontrar el usuario por ID en DAO: " + error.message);
        }
    }
}

module.exports = UserDAO;