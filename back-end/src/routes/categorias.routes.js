const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');
const { autenticarJWT, autorizarRol } = require('../middlewares/auth.middleware');
const ROLES = require('../config/roles');

// Admins: Registran categorías
router.post('/crear',
    autenticarJWT,
    autorizarRol(ROLES.ADMIN.nombre),
    categoriaController.crearCategoria
);

// Cualquier usuario puede obtener las categorías
// Por ID
router.get('/:id',
    autenticarJWT,
    categoriaController.obtenerCategoriaPorID
);
// Todas
router.get('/todas',
    autenticarJWT,
    categoriaController.obtenerCategorias
);

// Admins: Actualizan categorías
router.put('/actualizar/:id',
    autenticarJWT,
    autorizarRol(ROLES.ADMIN.nombre),
    categoriaController.actualizarCategoria
);

// Admins: Eliminan categorías
router.delete('/eliminar/:id',
    autenticarJWT,
    autorizarRol(ROLES.ADMIN.nombre),
    categoriaController.eliminarCategoria
);

module.exports = router;