const express = require('express');
const router = express.Router();
const conveniosController = require('../controllers/convenios.controller');
const { autenticarJWT, autorizarRol } = require('../middlewares/auth.middleware');
const ROLES = require('../config/roles');

// Admins y coordinadores registran convenios
router.post('/crear',
    autenticarJWT,
    autorizarRol(ROLES.ADMIN, ROLES.COORDINADOR),
    conveniosController.crearConvenio
);

// Cualquier usuario puede ver los convenios
// Por ID
router.get('/:id',
    autenticarJWT,
    conveniosController.obtenerConvenioPorID
);
// Todos
router.get('/todos',
    autenticarJWT,
    conveniosController.obtenerConvenios
);

// Admins y coordinadores actualizan convenios
router.put('/actualizar/:id',
    autenticarJWT,
    autorizarRol(ROLES.ADMIN, ROLES.COORDINADOR),
    conveniosController.actualizarConvenio
);

// Admins y coordinadores eliminan convenios
router.delete('/eliminar/:id',
    autenticarJWT,
    autorizarRol(ROLES.ADMIN, ROLES.COORDINADOR),
    conveniosController.eliminarConvenio
);

module.exports = router;