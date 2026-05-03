const dotenv = require('dotenv');

// Carga de las variables de entorno
dotenv.config();

// Exportación de las variables
module.exports = {
    API_PORT: process.env.API_PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET
};