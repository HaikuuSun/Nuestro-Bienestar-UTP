const Notificacion = require('../models/notificacion.model');
const { verificarUsuarioExistente } = require('./usuario.service');
const { verificarPostExistente } = require('./post.service');
const { obtenerUsuariosSuscritosACategoria } = require('./suscripcion.service');

// =================================================================================================== //
// Registrar una notificación
exports.generarNotificacion = async (post_id, usuario_id, tipo = 'info', tituloPersonalizado = null) => {
    try {
        // 1. Validar que existen el usuario y el post
        const usuario = await verificarUsuarioExistente(usuario_id);
        const post = await verificarPostExistente(post_id);

        // 2. Crear la notificación en la base de datos
        const notificacion = await Notificacion.create({
            titulo: tituloPersonalizado || `Nuevo post: ${post.titulo}`,
            mensaje: post.descripcion?.substring(0, 200) || 'Tienes una nueva notificación',
            tipo,
            usuario_id,
            post_id,
            leida: false,
            fecha_creacion: new Date()
        });

        // 3. Retornar la notificación con datos del post para enriquecer el payload
        return {
            id: notificacion.id,
            titulo: notificacion.titulo,
            mensaje: notificacion.mensaje,
            tipo: notificacion.tipo,
            leida: notificacion.leida,
            fecha_creacion: notificacion.fecha_creacion,
            post: {
                id: post.id,
                titulo: post.titulo
            }
        };
    } catch (error) {
        throw new Error(`Error al generar la notificación: ${error.message}`);
    }
};

// =============================================================================
// Generar notificaciones masivas para usuarios suscritos a una categoría
exports.generarNotificacionesPorCategoria = async (post_id, categoria_id) => {
    try {
        // 1. Verificar existencia del beneficio (post)
        const post = await verificarPostExistente(post_id);
        // 2. Obtener IDs de usuarios suscritos a esta categoría
        const usuariosIds = await obtenerUsuariosSuscritosACategoria(categoria_id);
        
        // 3. Manejar inexistencia de usuarios en una suscripción
        if (usuariosIds.length === 0) {
            return { message: 'No hay usuarios suscritos a esta categoría', enviados: 0 };
        }

        // 4. Generar notificación para cada usuario suscrito
        const promesas = usuariosIds.map(async (usuario_id) => {
            const notificacion = await this.generarNotificacion(post_id, usuario_id, 'info');
            // Emitir la notificación por socket
            io.to(`usuario_${usuario_id}`).emit('nueva_notificacion', notificacion);
            return notificacion;
        });
        // Array para almacenar las notificaciones generadas y enviadas
        const notificacionesEnviadas = await Promise.allSettled(promesas);

        // 5. Respuesta exitosa
        return {
            message: `Notificaciones enviadas a ${notificacionesEnviadas.length} usuarios`,
            enviados: notificacionesEnviadas.length,
            notificaciones: notificacionesEnviadas
        };
    } catch (error) {
        throw new Error(`Error al generar notificaciones masivas: ${error.message}`);
    }
};

// Obtener las notificaciones pendientes
exports.obtenerNotificacionesPendientes = async (usuario_id, limite) => {
    // Si se proporciona un límite para los resultados, convertir a tipo entero
    const limit = limite ? (parseInt(limite, 10)) : 20; // 20 resultados por defecto

    return await Notificacion.findAll({
        where: { 
            usuario_id,
            leida: false 
        },
        include: [{
            model: Post,
            as: 'post',
            attributes: ['id', 'titulo']
        }],
        order: [['fecha_creacion', 'DESC']],
        limit
    });
};

// Marcar como leída una notificación
exports.marcarComoLeida = async (usuario_id, notificacion_id) => {
    try {
        // 1. Obtener la notificación
        const notificacion = await Notificacion.findOne({
            where: {
                id: notificacion_id,
                usuario_id: usuario_id
            }
        });

        // 2. Verificar que existe
        if (!notificacion) {
            throw new Error('Notificación no encontrada con el ID proporcionado.');
        }

        // 3. Cambiar su estado
        await notificacion.update({
            leida: true,
            fecha_lectura: new Date()
        });

        // 4. Devolver actualizada
        const notificacionLeida = await notificacion.reload();
        return notificacionLeida;
    } catch (error) {
        throw new Error(`Error al marcar como leída la notificación: ${error.message}`);
    }
};

// Eliminar una notificación
exports.eliminarNotificacion = async (usuario_id, notificacion_id) => {
    try {
        // 1. Obtener la notificación perteneciente al usuario
        const objetivo = await Notificacion.findOne({
            where: {
                id: notificacion_id,
                usuario_id: usuario_id
            }
        });

        // 2. Eliminar de la BD
        await objetivo.destroy();

        return { message: 'Notificación eliminada exitosamente' };
    } catch (error) {
        throw new Error(`Error al eliminar la notificación: ${error.message}`);
    }
};