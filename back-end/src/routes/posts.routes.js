const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { autenticarJWT, autorizarRol } = require('../middlewares/auth.middleware');
const ROLES = require('../config/roles');

// Solo los admins pueden registrar beneficios
router.post('/crear',
    autenticarJWT,
    autorizarRol(ROLES.ADMIN.nombre),
    postController.crearPost
);

// Cualquier usuario puede leer los posts
// Por ID
router.get('/:id',
    autenticarJWT,
    postController.obtenerPostPorID
);
// Todos los beneficios
router.get('/todos',
    autenticarJWT,
    postController.obtenerPosts
);
// Por filtros
router.get('/filtrar',
    autenticarJWT,
    postController.filtrarPosts
);

// Admins y coordinadores pueden actualizar beneficios
router.put('/actualizar/:id',
    autenticarJWT,
    autorizarRol(ROLES.ADMIN.nombre, ROLES.COORDINADOR.nombre),
    postController.actualizarPost
);

// Solo los admins pueden eliminar beneficios
router.delete('/eliminar/:id',
    autenticarJWT,
    autorizarRol(ROLES.ADMIN.nombre),
    postController.eliminarPost
);

module.exports = router;