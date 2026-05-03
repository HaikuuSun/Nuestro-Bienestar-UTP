const Usuario = require('./usuario.model');
const Rol = require('./rol.model');
const Post = require('./post.model');
const Categoria = require('./categoria.model');
const Notificacion = require('./notificacion.model');

// ============== MAPEO DE ENTIDADES ============== //

// 1 usuario : 1 rol
Usuario.belongsTo(Rol, {
    foreignKey: 'id',
    targetKey: 'id'
});
// 1 rol : Muchos usuarios
Rol.hasMany(Usuario, {
    foreignKey: 'id'
});

// 1 post : 1 categoría
Post.belongsTo(Categoria, {
    foreignKey: 'id',
    targetKey: 'id'
});
// 1 categoría : Muchos posts
Categoria.hasMany(Post, {
    foreignKey: 'id'
});

// 1 notificación : 1 usuario
Notificacion.belongsTo(Usuario, {
    foreignKey: 'id',
    targetKey: 'id'
});
// 1 usuario : Muchas notificaciones
Usuario.hasMany(Notificacion, {
    foreignKey: 'id'
});
// 1 notificación : 1 post
Notificacion.belongsTo(Post, {
    foreignKey: 'id',
    targetKey: 'id'
});
// 1 post : Muchas notificaciones
Post.hasMany(Notificacion, {
    foreignKey: 'id'
});