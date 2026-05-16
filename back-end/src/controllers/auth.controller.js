const authService = require('../services/auth.service');

exports.login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const { token, refreshToken, usuario } = await authService.loginUsuario(correo, contrasena);

        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token,
            accessToken: token,
            refreshToken,
            usuario
        });
    } catch (error) {
        if (error.message.includes('Credenciales inválidas')) {
            res.status(401).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Se requiere refreshToken en el cuerpo de la solicitud.' });
    }

    try {
        const token = authService.refrescarToken(refreshToken);

        res.status(200).json({
            message: 'Token renovado exitosamente.',
            token,
            accessToken: token
        });
    } catch (error) {
        if (error.message.includes('expirado')) {
            return res.status(401).json({ message: 'Refresh token expirado. Por favor, inicie sesión de nuevo.' });
        }
        return res.status(403).json({ message: error.message });
    }
};