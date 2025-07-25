const UserDAO = require('../dao/mongo/UserDAO');
const CartDAO = require('../dao/mongo/CartDAO');

// Instanciamos los DAOs que el repositorio va a utilizar
// (Se mantienen aquí si se quieren usar como valores por defecto en el constructor)
const userDAO = new UserDAO();
const cartDAO = new CartDAO();

class UserRepository {
    // Constructor ahora acepta DAOs para inyección de dependencia
    constructor(_userDAO = userDAO, _cartDAO = cartDAO) { // Usamos valores por defecto
        this.userDAO = _userDAO;
        this.cartDAO = _cartDAO;
    }

    async registerUser(userData) {
        try {
            // 1. Crear un carrito para el nuevo usuario
            const newCart = await this.cartDAO.createCart();
            
            // *** CAMBIO CLAVE AQUÍ: Crear una copia del userData e INCLUIR explícitamente el cart ID ***
            const dataToCreateUser = {
                ...userData, // Copia todas las propiedades existentes
                cart: newCart._id // Asegura que el cart ID esté presente y sea un ObjectId
            };

            // 2. Crear el usuario usando el UserDAO con los datos que incluyen el carrito
            const newUser = await this.userDAO.createUser(dataToCreateUser);
            return newUser;
        } catch (error) {
            console.error("Error registering user in repository:", error);
            throw new Error("Could not register user: " + error.message);
        }
    }

    async findUserByEmail(email) {
        try {
            return await this.userDAO.findByEmail(email);
        } catch (error) {
            console.error("Error finding user by email in repository:", error);
            throw new Error("Could not find user by email: " + error.message);
        }
    }

    async findUserById(id) {
        try {
            return await this.userDAO.findById(id);
        } catch (error) {
            console.error("Error finding user by ID in repository:", error);
            throw new Error("Could not find user by ID: " + error.message);
        }
    }    
}

// Exportamos la CLASE UserRepository, no una instancia.
module.exports = UserRepository;