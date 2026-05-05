const jwt = require('jsonwebtoken'); // Autenticación (Generar tokens)
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/dotenv'); // Clave JWT
const Usuario = require('../models/usuario.model');
const Rol = require('../models/rol.model');

// Servicio de autenticación
exports.loginUsuario = async (correo, contrasena) => {
    try {
        // 1. Verificar si el usuario está registrado (incluir el rol)
        const usuario = await Usuario.findOne({ 
            where: { correo },
            include: [{ 
                model: Rol, 
                as: 'rol',
                attributes: ['id', 'nombre']
            }] 
        });
        
        if (!usuario) {
            throw new Error('Este correo no está registrado.');
        }

        // 2. Comprobar la contraseña
        const coincideContrasena = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!coincideContrasena) {
            throw new Error('Contraseña incorrecta.');
        }

        // 3. Generar el token JWT
        const payload = {
            id: usuario.id,
            correo: usuario.correo,
            rol: usuario.rol?.nombre,
            iat: Math.floor(Date.now() / 1000)
        };

        // Firmar el token con la clave JWT y definir un tiempo de expiración
        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        // 4. Retornar el token
        return {
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol?.nombre
            }
        };
    } catch (error) {
        throw new Error(`Error al intentar iniciar sesión: ${error.message}`);
    }
};

// Para decodificar y verificar el token
exports.verificarToken = (token) => {
    try {
        const decodificado = jwt.verify(token, JWT_SECRET);
        return decodificado;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token de autenticación expirado.');
        }
        throw new Error('Token de autenticación inválido.');
    }
};