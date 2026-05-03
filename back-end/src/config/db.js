const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Configuración para la conexión a la base de datos
const sequelize = new Sequelize (process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    timezone: '-05:00'
});

// Exportación de la instancia de conexión
module.exports = sequelize;