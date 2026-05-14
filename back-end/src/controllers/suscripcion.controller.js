const suscripcionService = require('../services/suscripcion.service');

exports.suscribirACategoria = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;
        const { categoria_id } = req.params;

        const resultado = await suscripcionService.suscribirACategoria(usuario_id, categoria_id);
        
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

exports.cancelarSuscripcion = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;
        const { categoria_id } = req.params;

        const resultado = await suscripcionService.cancelarSuscripcion(usuario_id, categoria_id);
        
        res.status(200).json({ success: true, ...resultado });
    } catch (error) {
        if (error.message.includes('No estás suscrito')) {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.obtenerMisSuscripciones = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;
        const suscripciones = await suscripcionService.obtenerSuscripcionesUsuario(usuario_id);
        
        res.status(200).json({
            success: true,
            count: suscripciones.length,
            data: suscripciones
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verificarEstadoSuscripcion = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;
        const { categoria_id } = req.params;
        
        const estaSuscrito = await suscripcionService.estaSuscritoACategoria(usuario_id, categoria_id);
        
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