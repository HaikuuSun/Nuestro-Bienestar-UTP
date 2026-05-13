const express = require('express');
const cors = require('cors');

const app = express(); // Instancia de Express

// Se habilita el uso de:
app.use(express.json()); // JSON para las solicitudes
app.use(cors()); // CORS (uso de la API desde el frontend)

// Importación de rutas
const authRoute = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuarios.routes');
const categoriaRoutes = require('./routes/categorias.routes');
const convenioRoutes = require('./routes/convenios.routes');
const postRoutes = require('./routes/posts.routes');

// Definición de prefijos para las rutas
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/usuarios', usuarioRoutes);
app.use('/api/v1/categorias', categoriaRoutes);
app.use('/api/v1/convenios', convenioRoutes);
app.use('/api/v1/posts', postRoutes);

// Exportación de la instancia de Express
module.exports = app;