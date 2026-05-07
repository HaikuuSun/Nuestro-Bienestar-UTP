const errorHandler = (err, req, res, next) => {
    // 1. Imprimir el error en la consola
    console.err(err.stack);
    // 2. Enviar una respuesta de error
    res.status(500).json({
        message: 'Error interno del servidor',
        error: err.message
    });
};

module.exports = errorHandler;