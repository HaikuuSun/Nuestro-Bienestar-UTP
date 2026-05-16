const Usuario = require('../models/usuario.model.js');
const Rol = require('../models/rol.model');
const bcrypt = require('bcryptjs');

// =================================================================================================== //
// Funciones de comprobación
async function verificarDatoRepetido(campo, valor, mensaje) {
    if (!valor) return; // Si no se entrega un valor, no hay nada que verificar

    const resultado = await Usuario.findOne({ where: { [campo]: valor } });

    if (resultado) {
        throw new Error(mensaje);
    }
}

async function verificarUsuarioExistente(id) {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        throw new Error('No se encuentra un usuario con este ID.');
    }

    return usuario;
}

async function obtenerIdRol(rolIdentificador) {
    if (!rolIdentificador) {
        throw new Error('El rol es requerido para registrar el usuario.');
    }

    if (typeof rolIdentificador === 'number' || /^[0-9]+$/.test(String(rolIdentificador))) {
        return Number(rolIdentificador);
    }

    const rol = await Rol.findOne({ where: { nombre: rolIdentificador } });
    if (!rol) {
        throw new Error(`No existe el rol '${rolIdentificador}'.`);
    }

    return rol.id;
}

// =================================================================================================== //
// Crear un usuario
exports.crearUsuario = async (nombre, correo, celular, contrasena, rolIdentificador) => {
    try {
        // 1. Verificaciones
        await verificarDatoRepetido('correo', correo, 'Este correo ya está en uso.');
        if (celular != null) {
            await verificarDatoRepetido('celular', celular, 'Este número de celular ya está registrado.');
        }

        const rol_id = await obtenerIdRol(rolIdentificador);

        // 2. Encriptado de la contraseña
        const hashedPass = await bcrypt.hash(contrasena, 10);

        // 3. Empaquetar los datos para realizar el registro
        const nuevoUsuario = await Usuario.create({
            nombre,
            correo,
            celular,
            contrasena: hashedPass,
            rol_id
        });

        // 4. Excluir contraseña de la respuesta
        const usuarioSinContrasena = nuevoUsuario.toJSON();
        delete usuarioSinContrasena.contrasena;
        return usuarioSinContrasena;
    } catch (error) {
        throw new Error(`Error al registrar el usuario: ${error.message}`);
    }
};

// =============================================================================
// Obtener un usuario por su ID
exports.obtenerUsuarioPorID = async (id) => {
    try {
        const objetivo = await verificarUsuarioExistente(id);

        const { contrasena, ...usuario } = objetivo.toJSON();
        return usuario;
    } catch (error) {
        throw new Error(`Error al obtener el usuario: ${error.message}`);
    }
};

// =============================================================================
// Obtener usuarios por rol
exports.obtenerUsuariosPorRol = async (rol_id) => {
    try {
        // Realizar la consulta, excluyendo la contraseña del resultado
        const usuarios = await Usuario.findAll({
            where: { rol_id },
            attributes: { exclude: ['contrasena'] }
        });

        return usuarios;
    } catch (error) {
        throw new Error(`Error al obtener los usuarios: ${error.message}`);
    }
};

// =============================================================================
// Actualizar usuario
exports.actualizarUsuario = async (id, datos) => {
    try {
        // 1. Obtener el usuario objetivo
        const objetivo = await verificarUsuarioExistente(id);

        // 2. Verificaciones para evitar duplicados (solo si el dato cambia)
        // Para el correo:
        if (datos.correo && datos.correo !== objetivo.correo) {
            await verificarDatoRepetido('correo', datos.correo, 'Este correo ya está en uso por otro usuario.');
        }
        // Para el número de celular:
        if (datos.celular && datos.celular !== objetivo.celular) {
            await verificarDatoRepetido('celular', datos.celular, 'Este número de celular ya está en uso por otro usuario.');
        }

        // 3. Encriptar la contraseña
        if (datos.contrasena) {
            datos.contrasena = await bcrypt.hash(datos.contrasena, 10);
        }

        // 4. Actualizar el usuario en la BD
        await objetivo.update(
            {
                nombre: datos.nombre,
                correo: datos.correo,
                celular: datos.celular,
                contrasena: datos.contrasena
            }, {
                where: { id }
            }
        );

        // 5. Devolver sin contraseña
        const usuarioActualizado = await objetivo.reload();
        const { contrasena, ...usuariosinContrasena } = usuarioActualizado.toJSON();
        return usuariosinContrasena;
    } catch (error) {
        throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
};

// =============================================================================
// Eliminar usuario
exports.eliminarUsuario = async (id) => {
    try {
        // 1. Comprobar si existe el usuario
        const objetivo = await verificarUsuarioExistente(id);
        // 2. Eliminar de la BD
        await objetivo.destroy();

        return { message: 'Usuario eliminado con éxito' };
    } catch (error) {
        throw new Error(`Error al eliminar el usuario: ${error.message}`)
    }
};

exports.verificarUsuarioExistente = verificarUsuarioExistente;