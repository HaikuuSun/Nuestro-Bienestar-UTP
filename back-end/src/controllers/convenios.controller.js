const conveniosService = require('../services/convenios.service');

// Registrar convenio
exports.crearConvenio = async (req, res) => {
    try {
        // 1. Extraer el dato del cuerpo de la solicitud
        const { nombre } = req.body;

        // 2. Llamar al servicio
        const nuevoConvenio = await conveniosService.crearConvenio(nombre);

        // 3. Respuesta exitosa
        res.status(201).json({ message: 'Convenio creado exitosamente', convenio: nuevoConvenio });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener convenio por ID
exports.obtenerConvenioPorID = async (req, res) => {
    try {
        // 1. Obtener el ID desde la URL
        const { id } = req.params;
        // 2. Llamar al servicio
        const convenio = await conveniosService.obtenerConvenioPorID(id);

        // Respuesta de error
        if (!convenio) {
            return res.status(404).json({ message: 'Convenio no encontrado.' });
        }

        // Respuesta exitosa
        res.status(200).json(convenio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener convenios
exports.obtenerConvenios = async (req, res) => {
    try {
        const convenios = await conveniosService.obtenerConvenios();
        res.status(200).json(convenios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un convenio
exports.actualizarConvenio = async (req, res) => {
    try {
        // 1. Obtener datos
        const { id } = req.params; // ID desde la URL
        const { nombre } = req.body; // Nombre desde el cuerpo de la solicitud

        // 2. Actualizar
        const convenioActualizado = await conveniosService.actualizarConvenio(id, nombre);

        // 3. Respuesta exitosa
        res.status(200).json(convenioActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar convenio
exports.eliminarConvenio = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await conveniosService.eliminarConvenio(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};