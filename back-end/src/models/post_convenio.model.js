const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PostConvenio = sequelize.define('post_convenios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    timestamps: false,
    tableName: 'post_convenios',
    indexes: [
        {
            unique: true,
            fields: ['post_id', 'convenio_id']
        }
    ]
});

module.exports = PostConvenio;