const Categoria = require('../models/categoria.model');

// =================================================================================================== //
// Funciones de comprobación
async function verificarDatoRepetido(campo, valor, mensaje) {
    if (!valor) return;

    const resultado = await Categoria.findOne({ where: { [campo]: valor } });

    if (!resultado) {
        throw new Error(mensaje);
    }
}

async function verificarCategoriaExistente(id) {
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
        throw new Error('No existe una categoría con este ID.');
    }

    return categoria;
}

// =================================================================================================== //
// Crear una categoría
exports.crearCategoria = async (nombre) => {
    try {
        // 1. Validar que el nombre no se repita
        await verificarDatoRepetido('nombre', nombre, 'Esta categoría ya existe.');
        // 2. Registro
        const nuevaCategoria = await Categoria.create({ nombre });

        return nuevaCategoria;
    } catch (error) {
        throw new Error(`Error al crear la categoría: ${error}`);
    }
};

// =============================================================================
// Obtener categoría por ID
exports.obtenerCategoriaPorID = async (id) => {
    try {
        const objetivo = await verificarCategoriaExistente(id);
        return objetivo;
    } catch (error) {
        throw new Error(`Error al obtener la categoría: ${error.message}`);
    }
};

// =============================================================================
// Obtener todas las categorías
exports.obtenerCategorias = async () => {
    try {
        const categorias = await Categoria.findAll();
        return categorias;
    } catch (error) {
        throw new Error(`Error al obtener las categorías: ${error.message}`);
    }
};

// =============================================================================
// Actualizar una categoría
exports.actualizarCategoria = async (id, nombre) => {
    try {
        // 1. Obtener la categoría objetivo
        const objetivo = await verificarCategoriaExistente(id);
        // 2. Verificar que no haya categorías con el mismo nombre
        if (nombre && nombre !== objetivo.nombre) {
            await verificarDatoRepetido('nombre', nombre, 'Otra categoría ya tiene este nombre.');
        }

        // 3. Actualizar la categoría en la BD
        await objetivo.update({ nombre: nombre }, { where: {id} });

        // 4. Devolver actualizado
        const categoriaActualizada = await objetivo.reload();
        return categoriaActualizada;
    } catch (error) {
        throw new Error(`Error al actualizar la categoría: ${error.message}`);
    }
};

// =============================================================================
// Eliminar una categoría
exports.eliminarCategoria = async (id) => {
    try {
        // 1. Comprobar si existe la categoría
        const objetivo = await verificarCategoriaExistente(id);
        // 2. Eliminar de la BD
        await objetivo.destroy();

        return { message: 'Categoría eliminada exitosamente' };
    } catch (error) {
        throw new Error(`Error al eliminar la categoría: ${error.message}`);
    }
};

export default verificarCategoriaExistente;