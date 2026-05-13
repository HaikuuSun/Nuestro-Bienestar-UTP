const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { autenticarJWT, autorizarRol } = require('../middlewares/auth.middleware');
const ROLES = require('../config/roles');

// Solo los administradores pueden registrar usuarios
router.post('/registro',
    autorizarRol(ROLES.ADMIN),
    usuarioController.crearUsuario
);

// Administradores y coordinadores pueden obtener cualquier usuario por su ID
router.get('/:id',
    autenticarJWT,
    autorizarRol(ROLES.ADMIN, ROLES.COORDINADOR),
    usuarioController.obtenerUsuarioPorID
);

// Cualquier usuario puede acceder a su propio perfil
router.get('/mi-perfil',
    autenticarJWT,
    usuarioController.obtenerMiPerfil
);

// Administradores y coordinadores pueden obtener usuarios por roles
router.get('/filtro-roles',
    autenticarJWT,
    autorizarRol(ROLES.ADMIN, ROLES.COORDINADOR),
    usuarioController.obtenerUsuariosPorRol
);

// Cualquier usuario puede actualizar su información
router.put('/actualizar/:id',
    autenticarJWT,
    usuarioController.actualizarUsuario
);

// Solo los administradores pueden eliminar usuarios del sistema
router.delete('/eliminar/:id',
    autenticarJWT,
    autorizarRol(ROLES.ADMIN),
    usuarioController.eliminarUsuario
);

module.exports = router;