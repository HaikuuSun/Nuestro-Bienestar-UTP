const notificacionService = require('../services/notificacion.service');
const { getIO } = require('../config/socket.config'); // Instancia de socket.io

// Generar y enviar una notificación
exports.crearNotificacion = async (req, res) => {
    try {
        // 1. Obtener los datos desde el cuerpo de la solicitud
        const { post_id, usuario_id, tipo } = req.body;

        // 2. Generar la notificación en BD
        const notificacion = await notificacionService.generarNotificacion(post_id, usuario_id, tipo);

        // 3. Emitir en tiempo real al usuario específico
        const io = getIO();
        io.to(`usuario_${usuario_id}`).emit('nueva_notificacion', notificacion);

        // 4. Respuesta exitosa
        return res.status(201).json({
            success: true,
            message: 'Notificación generada y enviada',
            notificacion
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Obtener las notificaciones pendientes del usuario activo
exports.obtenerNotificacionesPendientes = async (req, res) => {
    try {
        // 1. Obtener datos
        const id_usuario = req.usuario.id; // ID del usuario con la sesión activa
        const { limite } = req.query; // Cantidad de notificaciones a obtener

        // 2. Llamar al servicio
        const notificaciones = await notificacionService.obtenerNotificacionesPendientes(id_usuario, limite);

        // 3. Respuesta exitosa
        res.status(200).json(notificaciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Marcar una notificación como leída
exports.marcarComoLeida = async (req, res) => {
    try {
        // 1. Obtener datos
        const id_usuario = req.usuario.id; // ID del usuario con la sesión activa
        const { id_notificacion } = req.params; // ID desde la URL

        // 2. Actualizar el estado de la notificación
        const notificacion = await notificacionService.marcarComoLeida(id_usuario, id_notificacion);

        // 3. Respuesta exitosa
        res.status(200).json({
            success: true,
            message: 'Notificación marcada como leída',
            notificacion
        });
    } catch (error) {
        // Manejar error de "no encontrada" como 404
        if (error.message.includes('no encontrada')) {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Eliminar una notificación
exports.eliminarNotificacion = async (req, res) => {
    try {
        // 1. Obtener datos
        const id_usuario = req.usuario.id; // ID del usuario con la sesión activa
        const { id_notificacion } = req.params; // ID desde la URL

        // 2. Eliminar
        const resultado = await notificacionService.eliminarNotificacion(id_usuario, id_notificacion);

        // 3. Respuesta exitosa
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};