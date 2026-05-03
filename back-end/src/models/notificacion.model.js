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
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' }
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'posts', key: 'id' }
    }
}, {
    timestamps: false,
    tableName: 'notificaciones'
});

module.exports = Notificacion;