const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    celular: {
        type: DataTypes.INTEGER,
        unique: true
    },
    contrasena: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'roles', key: 'id' }
    }
}, {
    timestamps: false,
    tableName: 'usuarios'
});

module.exports = Usuario;