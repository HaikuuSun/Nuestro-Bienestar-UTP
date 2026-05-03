const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Categoria = sequelize.define('categorias', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false,
    tableName: 'categorias'
});

module.exports = Categoria;