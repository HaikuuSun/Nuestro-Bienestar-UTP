const Usuario = require('./usuario.model');
const Rol = require('./rol.model');
const Post = require('./post.model');
const Categoria = require('./categoria.model');
const Convenio = require('./convenio.model');
const PostConvenio = require('./post_convenio.model');
const Notificacion = require('./notificacion.model');

// ============== MAPEO DE ENTIDADES ============== //

// 1. Usuarios y Roles
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', targetKey: 'id' }); // 1 : 1
Rol.hasMany(Usuario, { foreignKey: 'rol_id', sourceKey: 'id' }); // 1 : N

// 2. Posts y Categorías
Post.belongsTo(Categoria, { foreignKey: 'categoria_id', targetKey: 'id' }); // 1 : 1
Categoria.hasMany(Post, { foreignKey: 'categoria_id', sourceKey: 'id' }); // 1 : N

// 3. Convenios y Posts (N : N)
Post.belongsToMany(Convenio, { 
    through: PostConvenio,
    foreignKey: 'post_id',
    otherKey: 'convenio_id',
    as: 'convenios'
});
Convenio.belongsToMany(Post, { 
    through: PostConvenio,
    foreignKey: 'convenio_id',
    otherKey: 'post_id',
    as: 'posts'
});

// 4. Notificaciones, Usuarios y Posts (Relación corregida)
// Una notificación pertenece a un usuario y a un post
Notificacion.belongsTo(Usuario, { foreignKey: 'usuario_id', targetKey: 'id' }); // 1 : 1
Usuario.hasMany(Notificacion, { foreignKey: 'usuario_id', sourceKey: 'id' }); // 1 : N

Notificacion.belongsTo(Post, { foreignKey: 'post_id', targetKey: 'id' }); // 1 : 1
Post.hasMany(Notificacion, { foreignKey: 'post_id', sourceKey: 'id' }); // 1 : N
