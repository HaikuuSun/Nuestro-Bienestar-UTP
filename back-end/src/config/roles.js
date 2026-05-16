module.exports = {
    USUARIOS: {
        nombre: 'usuarios',
        descripcion: 'Usuario institucional estándar',
        rutas: ['/perfil', '/notificaciones']
    },
    ADMIN: {
        nombre: 'admin',
        descripcion: 'Administrador con permisos de gestión',
        rutas: ['*']
    },
    SUPER_USUARIO: {
        nombre: 'superUsuario',
        descripcion: 'Superusuario con permisos para gestionar cuentas y configuración',
        rutas: ['*']
    },
    COORDINADOR: {
        nombre: 'coordinador',
        descripcion: 'Coordinador para gestión parcial de convenios y usuarios',
        rutas: ['/usuarios', '/convenios']
    },
    DOCENTE: {
        nombre: 'docente',
        descripcion: 'Docente con acceso a perfil y consulta de beneficios',
        rutas: ['/perfil']
    },
    DEPENDIENTE: {
        nombre: 'dependiente',
        descripcion: 'Personal dependiente con acceso limitado',
        rutas: ['/perfil']
    }
};