const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notificacion = sequelize.define('notificaciones', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    leida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    tipo: {
        type: DataTypes.ENUM('info', 'alerta', 'recordatorio'),
        defaultValue: 'info'
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_lectura: {
        type: DataTypes.DATE,
        allowNull: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' }
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'posts', key: 'id' }
    }
}, {
    timestamps: false,
    tableName: 'notificaciones'
});

module.exports = Notificacion;