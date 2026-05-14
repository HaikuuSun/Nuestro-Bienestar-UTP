const Post = require('../models/post.model');
const Categoria = require('../models/categoria.model');
const { verificarCategoriaExistente } = require('./categoria.service');
const { obtenerConveniosPorIDs } = require('./convenios.service');

// =================================================================================================== //
// Función de comprobación
async function verificarPostExistente(id) {
    const post = await Post.findByPk(id);
    
    if (!post) {
        throw new Error('No existe un post con este ID.');
    }

    return post;
}

// =================================================================================================== //
// Crear un post de beneficio
exports.crearPost = async (titulo, descripcion, fecha_validez, categoria_id, ids_convenios = []) => {
    try {
        // 1. Validar la existencia de la categoría
        const categoria = verificarCategoriaExistente(categoria_id);

        // 2. Empaquetar los datos para realizar el registro
        const nuevoPost = await Post.create({
            titulo,
            descripcion,
            fecha_validez,
            categoria_id
        });

        // 3. Asociar convenios si se proporcionan
        if (Array.isArray(ids_convenios) && ids_convenios.length > 0) {
            const convenios = await obtenerConveniosPorIDs(ids_convenios);
            await nuevoPost.addConvenios(convenios);
        }

        return nuevoPost;
    } catch (error) {
        throw new Error(`Error al crear el post: ${error.message}`);
    }
};

// =============================================================================
// Obtener un post por su ID
exports.obtenerPostPorID = async (id) => {
    try {
        const objetivo = await verificarPostExistente(id);
        return objetivo;
    } catch (error) {
        throw new Error(`Error al obtener el post por ID: ${error.message}`);
    }
};

// =============================================================================
// Obtener todos los posts
exports.obtenerPosts = async () => {
    try {
        const posts = await Post.findAll();
        return posts;
    } catch (error) {
        throw new Error(`Error al obtener los posts: ${error.message}`);
    }
}

// =============================================================================
// Búsqueda filtrada
exports.filtrarPosts = async (filtros = {}, opciones = {}) => {
    try {
        const posts = await Post.findAll({
            where: filtros,
            attributes: ['id', 'titulo', 'descripcion', 'fecha_validez', 'categoria_id'],
            order: opciones.order,
            limit: opciones.limit,
            offset: opciones.offset
        });

        return posts;
    } catch (error) {
        throw new Error(`Error al obtener los posts por filtros: ${error.message}`);
    }
};

// =============================================================================
// Actualizar un post
exports.actualizarPost = async (id, datos, ids_convenios = []) => {
    try {
        // 1. Obtener el post objetivo
        const objetivo = await verificarPostExistente(id);

        // 2. Actualizar el post en la BD
        await objetivo.update(
            {
                titulo: datos.titulo,
                descripcion: datos.descripcion,
                fecha_validez: datos.fecha_validez,
                categoria_id: datos.categoria_id
            }, {
                where: { id }
            }
        );

        // 3. Asociar convenios si se proporcionan
        if (Array.isArray(ids_convenios) && ids_convenios.length > 0) {
            const convenios = await obtenerConveniosPorIDs(ids_convenios);
            await objetivo.addConvenios(convenios);
        }

        // 4. Devolver actualizado
        const postActualizado = await objetivo.reload();
        return postActualizado;
    } catch (error) {
        throw new Error(`Error al actualizar el post: ${error.message}`);
    }
};

// =============================================================================
// Eliminar post
exports.eliminarPost = async (id) => {
    try {
        // 1. Comprobar si existe el post
        const objetivo = await verificarPostExistente(id);
        // 2. Eliminar de la BD
        await objetivo.destroy();

        return { message: 'Post eliminado con éxito' };
    } catch (error) {
        throw new Error(`Error al eliminar el post: ${error.message}`);
    }
};

module.exports = verificarPostExistente;