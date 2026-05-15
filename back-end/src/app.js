const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express(); // Instancia de Express

// Configuración de CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

// Se habilita el uso de:
app.use(express.json()); // JSON para las solicitudes
app.use(express.urlencoded({ extended: true })); // URL encoded
app.use(cors(corsOptions)); // CORS configurado para AWS y desarrollo

// Importación de rutas
const authRoute = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuarios.routes');
const categoriaRoutes = require('./routes/categorias.routes');
const convenioRoutes = require('./routes/convenios.routes');
const postRoutes = require('./routes/posts.routes');
const suscripcionRoutes = require('./routes/suscripcion.routes');
const notificacionRoutes = require('./routes/notificacion.routes');

// Definición de prefijos para las rutas
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/usuarios', usuarioRoutes);
app.use('/api/v1/categorias', categoriaRoutes);
app.use('/api/v1/convenios', convenioRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/suscripciones', suscripcionRoutes);
app.use('/api/v1/notificaciones', notificacionRoutes);

// Ruta de prueba de salud
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Middleware de errores (DEBE SER EL ÚLTIMO)
const errorHandler = require('./middlewares/error.middleware');
app.use(errorHandler);

// Exportación de la instancia de Express
module.exports = app;