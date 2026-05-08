const Convenio = require('../models/convenio.model');

// =================================================================================================== //
// Función de comprobación
async function verificarConvenioExistente(id) {
    const convenio = await Convenio.findByPk(id);

    if (!convenio) {
        throw new Error('No existe un convenio con este ID.');
    }

    return convenio
}

// =================================================================================================== //
// Crear convenio
exports.crearConvenio = async (nombre) => {
    try {
        const nuevoConvenio = await Convenio.create({ nombre: nombre });
        return nuevoConvenio;
    } catch (error) {
        throw new Error(`Error al registrar el convenio: ${error.message}`);
    }
};

// Obtener convenio por ID
exports.obtenerConvenioPorID = async (id) => {
    try {
        // 1. Comprobar que existe el convenio
        const objetivo = await verificarConvenioExistente(id);
        return objetivo;
    } catch (error) {
        throw new Error(`Error al obtener el convenio por ID: ${error.message}`);
    }
};

// Obtener todos los convenios
exports.obtenerConvenios = async () => {
    try {
        const convenios = await Convenio.findAll();
        return convenios;
    } catch (error) {
        throw new Error(`Error al obtener los convenios: ${error.message}`);
    }
};

// Actualizar un convenio
exports.actualizarConvenio = async (id, nombre) => {
    try {
        // 1. Obtener el convenio objetivo
        const objetivo = await verificarConvenioExistente(id);

        // 2. Actualizar el convenio en la BD
        await objetivo.update({ nombre: nombre });

        // 3. Devolver actualizado
        const convenioActualizado = await objetivo.reload();
        return convenioActualizado;
    } catch (error) {
        throw new Error(`Error al actualizar el convenio: ${error.message}`);
    }
};

// Eliminar convenio
exports.eliminarConvenio = async (id) => {
    try {
        // 1. Obtener el convenio
        const objetivo = await verificarConvenioExistente(id);
        // 2. Eliminar de la BD
        await objetivo.destroy();

        return { message: 'Convenio eliminado con éxito' };
    } catch (error) {
        throw new Error(`Error al eliminar el convenio: ${error.message}`);
    }
};