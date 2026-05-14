const express = require('express');
const router = express.Router();
const suscripcionController = require('../controllers/suscripcion.controller');
const { autenticarJWT } = require('../middlewares/auth.middleware');

// Suscribirse a una categoría
router.post('/categorias/:categoria_id',
    autenticarJWT,
    suscripcionController.suscribirACategoria
);

// Cancelar suscripción
router.delete('/categorias/:categoria_id',
    autenticarJWT,
    suscripcionController.cancelarSuscripcion
);

// Obtener mis suscripciones
router.get('/mis-suscripciones',
    autenticarJWT,
    suscripcionController.obtenerMisSuscripciones
);

// [Opcional] Verificar si estoy suscrito
router.get('/categorias/:categoria_id/estado',
    autenticarJWT,
    suscripcionController.verificarEstadoSuscripcion
);

module.exports = router;