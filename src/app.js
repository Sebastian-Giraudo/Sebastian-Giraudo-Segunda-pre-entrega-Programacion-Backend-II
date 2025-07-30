// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const passport = require('passport');
const initializePassport = require('./config/passport.config');
const cookieParser = require('cookie-parser');

// Importar routers
const sessionsRoutes = require('./routes/sessions.router');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');


const app = express();
const PORT = config.port;

// Middlewares GLOBALES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de Passport 
initializePassport(); 
app.use(passport.initialize()); 

// Rutas
app.use('/api/sessions', sessionsRoutes);
app.use('/api/products', productsRouter); 
app.use('/api/carts', cartsRouter);       


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
    res.status(500).json({ status: 'error', message: '¡Algo salió mal en el servidor!' });
});

// Conexión a MongoDB 
mongoose.connect(config.mongoURI)
    .then(() => {
        console.log('Conectado a MongoDB exitosamente.'); 
        // Iniciar el servidor SOLO después de conectar a la DB
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en el puerto ${PORT}.`); 
        });
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB:', err); 
        process.exit(1); // Sale de la aplicación si no puede conectar a la DB
    });
