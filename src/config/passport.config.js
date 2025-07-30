// src/config/passport.config.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./config');
const { createHash, isValidPassword } = require('../utils/utils');
const UserRepository = require('../repositories/UserRepository');
const UserDTO = require('../dto/user.dto');

const userRepository = new UserRepository();

const initializePassport = () => {
    // Estrategia local para registro
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const { first_name, last_name, age } = req.body;
                let user = await userRepository.findUserByEmail(username.trim()); 
                if (user) {
                    
                    return done(null, false, { message: 'El usuario ya existe.' });
                }

                const hashedPassword = createHash(password);

                const newUser = await userRepository.registerUser({
                    first_name,
                    last_name,
                    email: username.trim(), 
                    age,
                    password: hashedPassword,
                    role: 'user'
                });
                return done(null, newUser);
            } catch (error) {
                return done(error, false, { message: 'Error al registrar usuario.' });
            }
        }
    ));

    // Estrategia local para login
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await userRepository.findUserByEmail(email.trim());
                if (!user) {
                    
                    return done(null, false, { message: 'Usuario no encontrado.' });
                }
                if (!isValidPassword(user, password)) {
                    
                    return done(null, false, { message: 'Contraseña incorrecta.' });
                }

                // Generar el JWT aquí
                const token = jwt.sign(
                    { id: user._id, email: user.email, role: user.role, cartId: user.cart }, 
                    config.jwtPrivateKey,
                    { expiresIn: '1h' } // Token expira en 1 hora
                );

                return done(null, { user: new UserDTO(user), token: token }); // Devolver el DTO y el token
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Estrategia JWT para la sesión actual y protección de rutas
    passport.use('current', new jwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    let token = null;
                    if (req && req.cookies) {
                        token = req.cookies['coderCookieToken'];
                    }
                    return token;
                }
            ]),
            secretOrKey: config.jwtPrivateKey
        },
        async (jwt_payload, done) => {
            try {
                const user = await userRepository.findUserById(jwt_payload.id);
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado en la base de datos.' });
                }
                await user.populate('cart');
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userRepository.findUserById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

module.exports = initializePassport;