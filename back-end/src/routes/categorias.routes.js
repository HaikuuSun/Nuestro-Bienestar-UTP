const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');
const { autenticarJWT, autorizarRol } = require('../middlewares/auth.middleware');
const ROLES = require('../config/roles');

// Cualquier usuario puede obtener todas las categorías
// (Debe estar ANTES de /:id para evitar confusión)
router.get('/todas',
    autenticarJWT,
    categoriaController.obtenerCategorias
);

// Admins: Registran categorías
router.post('/crear',
    autenticarJWT,
    autorizarRol(ROLES.ADMIN.nombre),
    categoriaController.crearCategoria
);

// Cualquier usuario puede obtener una categoría por ID
router.get('/:id',
    autenticarJWT,
    categoriaController.obtenerCategoriaPorID
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