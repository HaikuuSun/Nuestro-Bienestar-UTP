const authService = require('../services/auth.service');

// Middleware para procesamiento de login
exports.autenticarJWT = (req, res, next) => {
    // 1. Obtener el encabezado de la solicitud
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'La solicitud debe tener el encabezado "Authorization Bearer".' });
    }

    // 2. Verificar el formato del encabezado para extraer el token
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Formato de token inválido. Se espera "Bearer [token]".' });
    }

    try {
        // 3. Verificar el token
        const decodificado = authService.verificarToken(token);
        // 4. Adjuntar la información decodificada a la solicitud
        req.usuario = decodificado;
        next();
    } catch (error) {
        // Capturar errores del servicio de autenticación (token inválido/expirado)
        if (error.message.includes('expirado')) {
            return res.status(401).json({ message: 'Token de autenticación expirado. Por favor, inicie sesión de nuevo.' });
        }
        return res.status(403).json({ message: 'Acceso denegado. Token inválido.' }); // 403 Forbidden para token inválido
    }
};

/**
 * Middleware para verificar si el usuario tiene un rol permitido
 * @param {string[]} rolesPermitidos - Array de roles que pueden acceder
 */
exports.autorizarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        // req.usuario ya fue adjuntado por autenticarJWT
        if (!req.usuario) {
            return res.status(401).json({ message: 'No autenticado.' });
        }

        const rolUsuario = req.usuario.rol;
        
        if (!rolesPermitidos.includes(rolUsuario)) {
            return res.status(403).json({ 
                message: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}` 
            });
        }

        next();
    };
};