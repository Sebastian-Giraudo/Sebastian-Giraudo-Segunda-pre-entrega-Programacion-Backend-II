const UserDAO = require('../dao/mongo/UserDAO');
const CartDAO = require('../dao/mongo/CartDAO');

const userDAO = new UserDAO();
const cartDAO = new CartDAO();

class UserRepository {
    
    constructor(_userDAO = userDAO, _cartDAO = cartDAO) { // Usamos valores por defecto
        this.userDAO = _userDAO;
        this.cartDAO = _cartDAO;
    }

    async registerUser(userData) {
        try {
            // 1. Crear un carrito para el nuevo usuario
            const newCart = await this.cartDAO.createCart();            
            
            const dataToCreateUser = {
                ...userData, // Copia todas las propiedades existentes
                cart: newCart._id // Asegura que el cart ID esté presente y sea un ObjectId
            };

            // 2. Crear el usuario usando el UserDAO con los datos que incluyen el carrito
            const newUser = await this.userDAO.createUser(dataToCreateUser);
            return newUser;
        } catch (error) {
            console.error("Error al registrar usuario en el respositorio:", error);
            throw new Error("No se pudo registrar el usuario: " + error.message);
        }
    }

    async findUserByEmail(email) {
        try {
            return await this.userDAO.findByEmail(email);
        } catch (error) {
            console.error("Error al encontrar el usuario por email en el repositorio:", error);
            throw new Error("No se pudo encontrar usuario por email: " + error.message);
        }
    }

    async findUserById(id) {
        try {
            return await this.userDAO.findById(id);
        } catch (error) {
            console.error("Error al encontrar usuario por ID en el repositorio:", error);
            throw new Error("No se pudo encontrar usuario por ID: " + error.message);
        }
    }    
}

module.exports = UserRepository;