const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./config');
const UserManager = require('../dao/managers/UserManager'); // Para buscar al usuario en la DB

const userManager = new UserManager();

const initializePassport = () => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del header 'Authorization: Bearer <token>'
        secretOrKey: config.jwtPrivateKey
    };

    passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await userManager.findById(jwt_payload.id);
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));

    // Estrategia "current" para validar el token y obtener los datos del usuario
    passport.use('current', new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await userManager.findById(jwt_payload.id);
            if (!user) {
                // Si el usuario no existe, devuelve un error 401 Unauthorized
                return done(null, false, { message: 'Token invalid or user not found' });
            }
            // Si el usuario existe y el token es válido, devuelve el usuario
            return done(null, user);
        } catch (error) {
            console.error("Error in 'current' strategy:", error);
            return done(error, false);
        }
    }));

    // Passport serializa y deserializa usuarios
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userManager.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

module.exports = initializePassport;