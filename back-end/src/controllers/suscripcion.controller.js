const suscripcionService = require('../services/suscripcion.service');

// Suscribir un usuario a una categoría
exports.suscribirACategoria = async (req, res) => {
    try {
        // 1. Obtener datos
        const usuario_id = req.usuario.id; // ID del usuario activo
        const { categoria_id } = req.params; // ID de la categoría desde la URL

        // 2. Realizar suscripción
        const resultado = await suscripcionService.suscribirACategoria(usuario_id, categoria_id);
        
        // 3. Respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Te has suscrito exitosamente a esta categoría',
            data: resultado
        });
    } catch (error) {
        if (error.message.includes('Ya estás suscrito')) {
            return res.status(409).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancelar una suscripción
exports.cancelarSuscripcion = async (req, res) => {
    try {
        // 1. Obtener datos
        const usuario_id = req.usuario.id; // ID del usuario activo
        const { categoria_id } = req.params; // ID de la categoría desde la URL

        // 2. Realizar cancelación
        const resultado = await suscripcionService.cancelarSuscripcion(usuario_id, categoria_id);
        
        // 3. Respuesta exitosa
        res.status(200).json({ success: true, ...resultado });
    } catch (error) {
        if (error.message.includes('No estás suscrito')) {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener las suscripciones del usuario con sesión activa
exports.obtenerMisSuscripciones = async (req, res) => {
    try {
        // 1. Obtener el ID del usuario activo
        const usuario_id = req.usuario.id;
        // 2. Llamar al servicio
        const suscripciones = await suscripcionService.obtenerSuscripcionesUsuario(usuario_id);
        
        // 3. Respuesta exitosa
        res.status(200).json({
            success: true,
            count: suscripciones.length,
            data: suscripciones
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verificar el estado de una suscripción
exports.verificarEstadoSuscripcion = async (req, res) => {
    try {
        // 1. Obtener datos
        const usuario_id = req.usuario.id; // ID del usuario activo
        const { categoria_id } = req.params; // ID de la categoría desde la URL
        
        // 2. Consultar
        const estaSuscrito = await suscripcionService.estaSuscritoACategoria(usuario_id, categoria_id);
        
        // 3. Respuesta exitosa
        res.status(200).json({
            success: true,
            usuario_id,
            categoria_id,
            suscrito: estaSuscrito
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};