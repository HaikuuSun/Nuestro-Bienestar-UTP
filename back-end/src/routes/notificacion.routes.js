// routes/notificacion.routes.js
const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacion.controller');
const { autenticarJWT, autorizarRol } = require('../middlewares/auth.middleware');
const ROLES = require('../config/roles');

// Obtener notificaciones pendientes (solo usuario autenticado)
router.get('/',
    autenticarJWT,
    notificacionController.obtenerNotificacionesPendientes
);

// Marcar como leída
router.put('/:id_notificacion/leida',
    autenticarJWT,
    notificacionController.marcarComoLeida
);

// Eliminar una notificación propia (solo el dueño puede borrarla)
router.delete('/:id_notificacion',
    autenticarJWT,
    notificacionController.eliminarNotificacion
);

module.exports = router;