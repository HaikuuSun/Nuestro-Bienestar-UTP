const SuscripcionCategoria = require('../models/suscripcion_categoria.model');
const { verificarUsuarioExistente } = require('./usuario.service');
const { verificarCategoriaExistente } = require('./categoria.service');

// =============================================================================
// Suscribirse a una categoría
exports.suscribirACategoria = async (usuario_id, categoria_id) => {
    try {
        // 1. Validar la existencia del usuario y la categoría
        const usuario = await verificarUsuarioExistente(usuario_id);
        const categoria = await verificarCategoriaExistente(categoria_id);

        // 2. Verificar si ya está suscrito
        const existente = await SuscripcionCategoria.findOne({
            where: { usuario_id, categoria_id }
        });

        // 3. Manejar suscripción existente
        if (existente) {
            if (existente.activa) {
                throw new Error('Ya estás suscrito a esta categoría.');
            }
            // Reactivar si estaba inactiva
            await existente.update({ activa: true, fecha_suscripcion: new Date() });
            return await existente.reload();
        }

        // 4. Crear nueva suscripción
        return await SuscripcionCategoria.create({
            usuario_id,
            categoria_id,
            activa: true,
            fecha_suscripcion: new Date()
        });
    } catch (error) {
        throw new Error(`Error al suscribirse: ${error.message}`);
    }
};

// =============================================================================
// Cancelar suscripción (solo cambia su estado)
exports.cancelarSuscripcion = async (usuario_id, categoria_id) => {
    try {
        // 1. Obtener especificando usuario, categoría y estado activo
        const suscripcion = await SuscripcionCategoria.findOne({
            where: { usuario_id, categoria_id, activa: true }
        });

        // 2. Manejar inexistencia de la suscripción
        if (!suscripcion) {
            throw new Error('No estás suscrito a esta categoría.');
        }

        // 3. Cambiar el estado
        await suscripcion.update({ activa: false });
        // 4. Respuesta exitosa
        return { message: 'Suscripción cancelada exitosamente' };
    } catch (error) {
        throw new Error(`Error al cancelar suscripción: ${error.message}`);
    }
};

// =============================================================================
// Obtener categorías suscritas por un usuario
exports.obtenerSuscripcionesUsuario = async (usuario_id) => {
    try {
        const suscripciones = await SuscripcionCategoria.findAll({
            where: { usuario_id, activa: true },
            include: [{
                model: require('../models/categoria.model'),
                attributes: ['id', 'nombre']
            }],
            order: [['fecha_suscripcion', 'DESC']]
        });

        return suscripciones;
    } catch (error) {
        throw new Error(`Error al obtener suscripciones: ${error.message}`);
    }
};

// =============================================================================
// Para notificaciones: Obtener usuarios suscritos a una categoría
exports.obtenerUsuariosSuscritosACategoria = async (categoria_id) => {
    try {
        const suscripciones = await SuscripcionCategoria.findAll({
            where: { categoria_id, activa: true },
            attributes: ['usuario_id']
        });

        return suscripciones.map(s => s.usuario_id);
    } catch (error) {
        throw new Error(`Error al obtener usuarios suscritos: ${error.message}`);
    }
};

// =============================================================================
// Verificar si un usuario está suscrito a una categoría
exports.estaSuscritoACategoria = async (usuario_id, categoria_id) => {
    // Filtrar por su estado
    const suscripcion = await SuscripcionCategoria.findOne({
        where: { usuario_id, categoria_id, activa: true }
    });

    return !!suscripcion;
};