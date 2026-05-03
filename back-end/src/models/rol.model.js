const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rol = sequelize.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    permisos: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    tablename: 'roles'
});

module.exports = Rol;