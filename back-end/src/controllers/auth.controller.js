const authService = require('../services/auth.service');

exports.login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const { token, usuario } = await authService.loginUsuario(correo, contrasena);

        res.status(200).json({ message: 'Inicio de sesión exitoso.', token, usuario });
    } catch (error) {
        if (error.message.includes('Credenciales inválidas')) {
            res.status(401).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};