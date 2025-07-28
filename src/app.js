//scr/app.js
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const passport = require('passport');
const initializePassport = require('./config/passport.config');
const cookieParser = require('cookie-parser');

// Importar routers
const usersRoutes = require('./routes/users.router');
const sessionsRoutes = require('./routes/sessions.router');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');


const app = express();
const PORT = config.port;

// Middlewares GLOBALES (se aplican a todas las rutas)
app.use(express.json()); // Para parsear cuerpos de solicitud JSON
app.use(express.urlencoded({ extended: true })); // Para parsear cuerpos de solicitud URL-encoded
app.use(cookieParser()); // Para parsear cookies

// Configuración de Passport
initializePassport(); // Inicializa las estrategias de Passport
app.use(passport.initialize()); // Inicializa Passport en Express

// Rutas
app.use('/api/users', usersRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/products', productsRouter); // Conectar router de productos
app.use('/api/carts', cartsRouter);       // Conectar router de carritos


// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Bienvenido al E-commerce!');
});

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ status: 'error', message: 'Ruta no encontrada.' });
});

// Manejo de errores generales (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Algo salió mal!' });
});

// Conexión a MongoDB
mongoose.connect(config.mongoURI)
    .then(() => {
        console.log('Conexión a MongoDB exitosa!');
        // Iniciar el servidor SOLO después de conectar a la DB
        app.listen(PORT, () => {
            console.log(`Server ejecutándose en puerto ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al conectarse en MongoDB:', err);
        process.exit(1); // Sale de la aplicación si no puede conectar a la DB
    });

