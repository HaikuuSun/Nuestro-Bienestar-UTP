const usuarioService = require('../services/usuario.service');

// Registro de usuarios
exports.crearUsuario = async (req, res) => {
    try {
        // 1. Extraer los datos del cuerpo de la solicitud
        const { nombre, correo, celular, contrasena, rol_id } = req.body;

        // 2. Llamar al servicio
        const nuevoUsuario = await usuarioService.crearUsuario(nombre, correo, celular, contrasena, rol_id);

        // 3. Responder con código de éxito (201)
        res.status(201).json({ message: 'Usuario registrado exitosamente', usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un usuario
exports.obtenerUsuarioPorID = async (req, res) => {
    try {
        // 1. Obtención de datos básicos
        const { id } = req.params; // ID desde la URL
        // 2. Llamar al servicio
        const usuario = await usuarioService.obtenerUsuarioPorID(id);
        
        // 3. Responder con código 404 si no existe el usuario
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // 4. Responder con código 200 si se aprueban las validaciones
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Acceder al perfil (usuario autenticado)
exports.obtenerMiPerfil = async (req, res) => {
    try {
        // 1. Obtener el ID del usuario activo
        const idUsuario = req.usuario.id;
        // 2. Obtener el usuario con este ID
        const usuario = await usuarioService.obtenerUsuarioPorID(idUsuario);

        // 3. Responder con código 404
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // 4. Respuesta exitosa
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener usuarios por rol
exports.obtenerUsuariosPorRol = async (req, res) => {
    try {
        // Obtener el ID del rol desde la URL
        const { rol_id } = req.params;
        const usuarios = await usuarioService.obtenerUsuariosPorRol(rol_id);
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        // 1. Cargar el ID del usuario activo
        const id = req.usuario.id;
        // 2. Obtener los datos desde el cuerpo de la solicitud
        const { nombre, correo, celular, contrasena } = req.body;
        const datos = [nombre, correo, celular, contrasena]; // Empaquetar los datos
        // 3. Actualizar el usuario
        const usuarioActualizado = await usuarioService.actualizarUsuario(id, datos);
        // 4. Respuesta exitosa
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        // 1. Cargar el ID del usuario activo
        const id = req.usuario.id;
        // 2. Eliminar
        const resultado = await usuarioService.eliminarUsuario(id);
        // 3. Respuesta exitosa
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};