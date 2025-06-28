const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const passport = require('passport');
const initializePassport = require('./config/passport.config');
const cookieParser = require('cookie-parser');

// Importar routers
const usersRoutes = require('./routes/users.router');
const sessionsRoutes = require('./routes/sessions.router');


const app = express();
const PORT = config.port;

// Middlewares
app.use(express.json()); // Para parsear cuerpos de solicitud JSON
app.use(express.urlencoded({ extended: true })); // Para parsear cuerpos de solicitud URL-encoded
app.use(cookieParser()); // Para parsear cookies

// Configuración de Passport
initializePassport();
app.use(passport.initialize()); // Inicializa Passport

// Conexión a MongoDB
mongoose.connect(config.mongoURI)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Sale de la aplicación si no puede conectar a la DB
    });

// Rutas
app.use('/api/users', usersRoutes);
app.use('/api/sessions', sessionsRoutes);


// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Bienvenido al E-commerce!');
});

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Manejo de errores generales (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Something went wrong!' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});