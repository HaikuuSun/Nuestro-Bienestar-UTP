const usuarioService = require('../services/usuario.service');
const Rol = require('../models/rol.model');
const ROLES = require('../config/roles');

/**
 * Crear un nuevo usuario (solo superUsuarios)
 * POST /api/v1/usuarios/registro
 */
exports.crearUsuario = async (req, res, next) => {
    try {
        // Validar que existan los campos requeridos
        const { nombre, correo, celular, contrasena, rol_id, rol } = req.body;
        
        if (!nombre || !correo || !contrasena) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre, correo y contraseña son requeridos'
            });
        }

        const nuevoUsuario = await usuarioService.crearUsuario(nombre, correo, celular, contrasena, rol_id || rol);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: nuevoUsuario
        });
    } catch (error) {
        next(error);
    }
};

exports.obtenerRoles = async (req, res, next) => {
    try {
        const roles = await Rol.findAll({ attributes: ['id', 'nombre'] });
        res.status(200).json({
            success: true,
            data: roles
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtener un usuario por ID
 * GET /api/v1/usuarios/:id
 */
exports.obtenerUsuarioPorID = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea válido
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }

        const usuario = await usuarioService.obtenerUsuarioPorID(id);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: usuario
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtener perfil del usuario autenticado
 * GET /api/v1/usuarios/mi-perfil
 */
exports.obtenerMiPerfil = async (req, res, next) => {
    try {
        const idUsuario = req.usuario.id;
        const usuario = await usuarioService.obtenerUsuarioPorID(idUsuario);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: usuario
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtener usuarios filtrados por rol
 * GET /api/v1/usuarios/filtro-roles?rol_id=X
 */
exports.obtenerUsuariosPorRol = async (req, res, next) => {
    try {
        const { rol_id } = req.query;
        
        if (!rol_id || isNaN(rol_id)) {
            return res.status(400).json({
                success: false,
                message: 'El parámetro rol_id es requerido y debe ser un número'
            });
        }

        const usuarios = await usuarioService.obtenerUsuariosPorRol(rol_id);
        
        res.status(200).json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Actualizar datos del usuario autenticado
 * PUT /api/v1/usuarios/actualizar/:id
 */
exports.actualizarUsuario = async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id;
        const paramId = req.params.id;
        const rolUsuario = req.usuario.rol;
        
        // Verificar que el usuario solo pueda actualizar su propio perfil (excepto si es admin o superUsuario)
        if (usuarioId !== parseInt(paramId) && rolUsuario !== ROLES.ADMIN.nombre && rolUsuario !== ROLES.SUPER_USUARIO.nombre) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para actualizar este usuario'
            });
        }

        const { nombre, correo, celular, contrasena } = req.body;
        const datos = { nombre, correo, celular, contrasena };

        const usuarioActualizado = await usuarioService.actualizarUsuario(paramId, datos);

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: usuarioActualizado
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Eliminar un usuario (solo admins)
 * DELETE /api/v1/usuarios/eliminar/:id
 */
exports.eliminarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }

        const resultado = await usuarioService.eliminarUsuario(id);

        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente',
            data: resultado
        });
    } catch (error) {
        next(error);
    }
};