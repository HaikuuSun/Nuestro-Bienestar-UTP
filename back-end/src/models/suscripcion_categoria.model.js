const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SuscripcionCategoria = sequelize.define('suscripciones_categoria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_suscripcion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' }
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'categorias', key: 'id' }
    }
}, {
    timestamps: false,
    tableName: 'suscripciones_categoria'
});

module.exports = SuscripcionCategoria;