const categoriaService = require('../services/categoria.service');

/**
 * Crear una nueva categoría (solo admins)
 * POST /api/v1/categorias/crear
 */
exports.crearCategoria = async (req, res, next) => {
    try {
        const { nombre } = req.body;

        // Validar que el nombre sea proporcionado
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El campo nombre es requerido'
            });
        }

        const nuevaCategoria = await categoriaService.crearCategoria(nombre);

        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: nuevaCategoria
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtener categoría por ID
 * GET /api/v1/categorias/:id
 */
exports.obtenerCategoriaPorID = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validar que el ID sea válido
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de categoría inválido'
            });
        }

        const categoria = await categoriaService.obtenerCategoriaPorID(id);

        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: categoria
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtener todas las categorías
 * GET /api/v1/categorias/todas
 */
exports.obtenerCategorias = async (req, res, next) => {
    try {
        const categorias = await categoriaService.obtenerCategorias();

        res.status(200).json({
            success: true,
            data: categorias,
            count: categorias.length
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Actualizar categoría (solo admins)
 * PUT /api/v1/categorias/actualizar/:id
 */
exports.actualizarCategoria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        // Validar inputs
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de categoría inválido'
            });
        }

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El campo nombre es requerido'
            });
        }

        const categoriaActualizada = await categoriaService.actualizarCategoria(id, nombre);

        if (!categoriaActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            data: categoriaActualizada
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Eliminar categoría (solo admins)
 * DELETE /api/v1/categorias/eliminar/:id
 */
exports.eliminarCategoria = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validar que el ID sea válido
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de categoría inválido'
            });
        }

        const resultado = await categoriaService.eliminarCategoria(id);

        if (!resultado) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Categoría eliminada exitosamente',
            data: resultado
        });
    } catch (error) {
        next(error);
    }
};