const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('posts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fecha_validez: {
        type: DataTypes.DATE,
        allowNull: false
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'categorias', key: 'id' }
    },
    notificacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'notificaciones', key: 'id' }
    }
}, {
    timestamps: false,
    tableName: 'posts'
});

module.exports = Post;