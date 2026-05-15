/**
 * Middleware global para manejo centralizado de errores
 * Debe ser usado al final de todas las rutas
 */
const errorHandler = (err, req, res, next) => {
    // 1. Loguear el error en la consola
    console.error('[ERROR]', err);
    
    // 2. Determinar el código de estado
    let statusCode = err.status || err.statusCode || 500;
    let message = err.message || 'Error interno del servidor';
    
    // 3. Manejar errores específicos de Sequelize
    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409; // Conflict
        message = 'El registro ya existe o viola una restricción única';
    } else if (err.name === 'SequelizeValidationError') {
        statusCode = 400; // Bad Request
        message = 'Error de validación: ' + err.errors.map(e => e.message).join(', ');
    } else if (err.name === 'SequelizeConnectionError') {
        statusCode = 503; // Service Unavailable
        message = 'Error conectando a la base de datos';
    }
    
    // 4. Enviar respuesta de error
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { error: err.stack })
    });
};

module.exports = errorHandler;