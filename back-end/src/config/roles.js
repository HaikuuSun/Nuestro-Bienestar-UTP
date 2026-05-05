module.exports = {
    ADMIN: {
        nombre: 'Administrador',
        descripcion: 'Acceso total al sistema',
        rutas: ['*']  // Acceso para todas las rutas
    },
    COORDINADOR: {
        nombre: 'Coordinador',
        descripcion: 'Puede leer usuarios y actualizar beneficios',
        rutas: ['/usuarios', '/beneficios']
    },
    DOCENTE: {
        nombre: 'Docente',
        descripcion: 'Gestión de su propio perfil, lectura y gestión de sus inscripciones a beneficios',
        rutas: ['/perfil', '/beneficios/leer', '/beneficios/inscribir']
    },
    DEPENDENDIENTE: {
        nombre: 'Personal dependiente',
        descripcion: 'Gestión de su propio perfil, lectura y gestión de sus inscripciones a beneficios',
        rutas: ['/perfil', '/beneficios/leer', '/beneficios/inscribir']
    }
};