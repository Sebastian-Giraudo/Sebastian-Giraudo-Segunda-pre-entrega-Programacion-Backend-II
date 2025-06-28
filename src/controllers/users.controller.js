const bcrypt = require('bcrypt');
const UserManager = require('../dao/managers/UserManager');
const { generateToken } = require('../utils/jwt.utils');

const userManager = new UserManager();

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
    const { first_name, last_name, email, age, password, role } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({ status: 'error', message: 'All fields are required.' });
    }

    try {
        const existingUser = await userManager.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'User with this email already exists.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10); // Encriptar la contraseña
        
        const newUser = await userManager.createUser({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: role || 'user' // Si no se especifica rol, por defecto 'user'
        });

        res.status(201).json({ status: 'success', message: 'User registered successfully', user: {
            id: newUser._id,
            first_name: newUser.first_name,
            email: newUser.email,
            role: newUser.role,
            cart: newUser.cart
        }});

    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ status: 'error', message: 'Internal server error during registration: ' + error.message });
    }
};

// Función para el login de usuarios
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
    }

    try {
        const user = await userManager.findByEmail(email);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });
        }

        const token = generateToken(user);

        // Envía el token en una cookie o en la respuesta JSON
        res.cookie('coderCookieToken', token, {
            maxAge: 60 * 60 * 1000, // 1 hora en milisegundos
            httpOnly: true // Para que la cookie no sea accesible desde JavaScript del lado del cliente
        }).json({ status: 'success', message: 'Login successful', token, user: {
            id: user._id,
            first_name: user.first_name,
            email: user.email,
            role: user.role,
            cart: user.cart
        }});

    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ status: 'error', message: 'Internal server error during login: ' + error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};