const express = require('express');
const cors = require('cors');

const app = express(); // Instancia de Express

// Se habilita el uso de:
app.use(express.json()); // JSON para las solicitudes
app.use(cors()); // CORS

// Importación de rutas


// Uso de rutas


// Exportación de la instancia de Express
module.exports = app;