const postService = require('../services/post.service');

// Crear un post de beneficio
exports.crearPost = async (req, res) => {
    try {
        // 1. Extraer los datos del cuerpo de la solicitud
        const { titulo, descripcion, fecha_validez, categoria_id, ids_convenios } = req.body;
        
        // 2. Llamar al servicio
        const nuevoPost = await postService.crearPost(titulo, descripcion, fecha_validez, categoria_id, ids_convenios);

        // 3. Respuesta exitosa
        res.status(201).json({ message: 'Post creado exitosamente', post: nuevoPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un post por ID
exports.obtenerPostPorID = async (req, res) => {
    try {
        // 1. Obtención de datos básicos
        const { id } = req.params; // ID desde la URL
        // 2. Llamar al servicio
        const post = await postService.obtenerPostPorID(id);

        // Respuesta de error
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        // Respuesta exitosa
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los posts
exports.obtenerPosts = async (req, res) => {
    try {
        const posts = await postService.obtenerPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Búsqueda filtrada
exports.filtrarPosts = async (req, res) => {
    try {
        // 1. Obtener los datos de filtrado desde el cuerpo de la solicitud
        const { filtros, opciones } = req.body;
        // 2. Aplicar los filtros
        const posts = await postService.filtrarPosts(filtros, opciones);
        // 3. Respuesta exitosa
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un post
exports.actualizarPost = async (req, res) => {
    try {
        // 1. Cargar los datos
        const { id } = req.params; // ID desde la URL
        const { titulo, descripcion, fecha_validez, categoria_id, ids_convenios } = req.body; // Datos para actualizar
        const datos = [titulo, descripcion, fecha_validez, categoria_id]; // Emapquetar los datos básicos

        // 2. Actualizar
        const postActualizado = await postService.actualizarPost(id, datos, ids_convenios);

        // 3. Respuesta exitosa
        res.status(200).json(postActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar post
exports.eliminarPost = async (req, res) => {
    try {
        // 1. Obtener el ID desde la URL
        const { id } = req.params;
        // 2. Eliminar
        const resultado = await postService.eliminarPost(id);
        // 3. Respuesta exitosa
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};