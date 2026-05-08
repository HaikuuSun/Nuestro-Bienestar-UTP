const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Convenio = sequelize.define('convenios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false,
    tableName: 'convenios'
});

module.exports = Convenio;