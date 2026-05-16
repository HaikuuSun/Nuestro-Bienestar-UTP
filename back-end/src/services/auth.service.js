const jwt = require('jsonwebtoken'); // Autenticación (Generar tokens)
const bcrypt = require('bcryptjs');
const {
    JWT_SECRET,
    JWT_SECRET_ACCESS,
    JWT_SECRET_REFRESH,
    JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN
} = require('../config/dotenv'); // Claves y expiraciones JWT
const Usuario = require('../models/usuario.model');
const Rol = require('../models/rol.model');

const accessSecret = JWT_SECRET_ACCESS || JWT_SECRET;
const refreshSecret = JWT_SECRET_REFRESH || JWT_SECRET;
const accessExpiresIn = JWT_EXPIRES_IN || '15m';
const refreshExpiresIn = JWT_REFRESH_EXPIRES_IN || '7d';

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

        // 3. Generar tokens JWT
        const payload = {
            id: usuario.id,
            correo: usuario.correo,
            rol: usuario.rol?.nombre,
            iat: Math.floor(Date.now() / 1000)
        };

        const accessToken = jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn });
        const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn });

        // 4. Retornar tokens y usuario
        return {
            token: accessToken,
            refreshToken,
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

exports.generarAccessToken = (payload) => {
    return jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn });
};

exports.verificarToken = (token) => {
    try {
        return jwt.verify(token, accessSecret);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token de autenticación expirado.');
        }
        throw new Error('Token de autenticación inválido.');
    }
};

exports.verificarRefreshToken = (refreshToken) => {
    try {
        return jwt.verify(refreshToken, refreshSecret);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Refresh token expirado.');
        }
        throw new Error('Refresh token inválido.');
    }
};

exports.refrescarToken = (refreshToken) => {
    const decodificado = exports.verificarRefreshToken(refreshToken);
    const payload = {
        id: decodificado.id,
        correo: decodificado.correo,
        rol: decodificado.rol,
        iat: Math.floor(Date.now() / 1000)
    };
    return exports.generarAccessToken(payload);
};