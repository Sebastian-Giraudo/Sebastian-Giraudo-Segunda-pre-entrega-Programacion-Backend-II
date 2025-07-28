//src/config/passport.config.js

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config');
const UserDAO = require('../dao/mongo/UserDAO');
const CartDAO = require('../dao/mongo/CartDAO'); 
const { generateToken } = require('../utils/jwt.utils');
const { createHash, isValidPassword } = require('../utils/utils');
const UserRepository = require('../repositories/UserRepository');

// Instanciamos los DAOs
const userDAO = new UserDAO();
const cartDAO = new CartDAO();

// Instanciamos el UserRepository con sus DAOs
const userRepository = new UserRepository(userDAO, cartDAO); 

const initializePassport = () => {
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await userRepository.findUserByEmail(email); 
                if (!user) {
                    console.log('Usuario no encontrado con correo electrónico: ' + email);
                    return done(null, false, { message: 'Credenciales incorrectas.' });
                }
                if (!isValidPassword(user, password)) { 
                    console.log('Contraseña no válida para el usuario: ' + email);
                    return done(null, false, { message: 'Credenciales incorrectas.' });
                }

                console.log("Estrategia de inicio de sesión de Passport: ojeto de usuario antes de generar el token:", user);

                const userForToken = {
                    id: user._id.toString(),
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role,
                    cart: user.cart ? user.cart._id.toString() : null 
                };
                const token = generateToken(userForToken);
                user.token = token;
                user.user = userForToken;
                return done(null, user);
            } catch (error) {

                console.error("Error en la estrategia de inicio de sesión:", error);

                return done(error);
            }
        }
    ));

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            const { first_name, last_name, age } = req.body;
            try {
                const existingUser = await userRepository.findUserByEmail(email);
                if (existingUser) {
                    console.log('El usuario ya existe con el correo: ' + email);
                    return done(null, false, { message: 'El usuario ya existe.' });
                }

                const hashedPassword = createHash(password); 
                
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashedPassword,
                    role: 'user' 
                };

                const createdUser = await userRepository.registerUser(newUser); 
                console.log("Nuevo usuario registrado a través de UserRepository:", createdUser);
                
                return done(null, createdUser); 
            } catch (error) {
                console.error("Error en la estrategia de registro:", error);
                return done(error);
            }
        }
    ));

    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtPrivateKey
    };

    passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await userDAO.findById(jwt_payload.id);
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));

    passport.use('current', new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await userDAO.findById(jwt_payload.id);
            if (!user) {
                return done(null, false, { message: 'Token inválido o no encontrado.' });
            }
            // Aseguramos que el carrito se adjunte como ID o null para el DTO
            user.cart = user.cart ? user.cart._id.toString() : null; 
            return done(null, user);
        } catch (error) {
            console.error("Error en la estrategia actual:", error);
            return done(error, false);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userDAO.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

module.exports = initializePassport;