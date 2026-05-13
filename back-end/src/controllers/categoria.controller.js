const categoriaService = require('../services/categoria.service');

// Registrar categoría
exports.crearCategoria = async (req, res) => {
    try {
        // 1. Extraer el dato del cuerpo de la solicitud
        const { nombre } = req.body;

        // 2. Llamar al servicio
        const nuevaCategoria = await categoriaService.crearCategoria(nombre);

        // 3. Respuesta exitosa
        res.status(201).json({ message: 'Categoría creada exitosamente', categoria: nuevaCategoria });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener categoría por ID
exports.obtenerCategoriaPorID = async (req, res) => {
    try {
        // 1. Obtener el ID desde la URL
        const { id } = req.params;
        // 2. Llamar al servicio
        const categoria = await categoriaService.obtenerCategoriaPorID(id);

        // Respuesta de error
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }

        // Respuesta exitosa
        res.status(200).json(categoria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener categorías
exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await categoriaService.obtenerCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar categoría
exports.actualizarCategoria = async (req, res) => {
    try {
        // 1. Obtener datos
        const { id } = req.params; // ID desde la URL
        const { nombre } = req.body; // Nombre desde el cuerpo de la solicitud

        // 2. Actualizar
        const categoriaActualizada = await categoriaService.actualizarCategoria(id, nombre);

        // 3. Respuesta exitosa
        res.status(200).json(categoriaActualizada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar categoría
exports.eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await categoriaService.eliminarCategoria(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};