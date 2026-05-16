-- Script de inicialización para MySQL
-- Crea el esquema si no existe, crea las tablas necesarias y agrega datos semilla.

SET @@session.sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION';

CREATE DATABASE IF NOT EXISTS `nuestro_bienestar`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `nuestro_bienestar`;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `roles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `permisos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(60) NOT NULL UNIQUE,
    `descripcion` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `rol_permisos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `rol_id` INT NOT NULL,
    `permiso_id` INT NOT NULL,
    UNIQUE KEY `ux_rol_permiso` (`rol_id`, `permiso_id`),
    CONSTRAINT `fk_rol_permisos_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_rol_permisos_permiso` FOREIGN KEY (`permiso_id`) REFERENCES `permisos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `configuraciones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `clave` VARCHAR(100) NOT NULL UNIQUE,
    `valor` VARCHAR(255) NOT NULL,
    `descripcion` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `categorias` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `convenios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `usuarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(255) NOT NULL UNIQUE,
    `celular` INT NULL UNIQUE,
    `contrasena` VARCHAR(60) NOT NULL,
    `rol_id` INT NOT NULL,
    CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `posts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `titulo` VARCHAR(40) NOT NULL UNIQUE,
    `descripcion` TEXT NOT NULL,
    `fecha_validez` DATE NOT NULL,
    `categoria_id` INT NOT NULL,
    CONSTRAINT `fk_posts_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `post_convenios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `post_id` INT NOT NULL,
    `convenio_id` INT NOT NULL,
    UNIQUE KEY `ux_post_convenio` (`post_id`, `convenio_id`),
    CONSTRAINT `fk_post_convenios_post` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_post_convenios_convenio` FOREIGN KEY (`convenio_id`) REFERENCES `convenios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `notificaciones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `titulo` VARCHAR(50) NOT NULL,
    `mensaje` TEXT NULL,
    `leida` TINYINT(1) NOT NULL DEFAULT 0,
    `tipo` ENUM('info', 'alerta', 'recordatorio') NOT NULL DEFAULT 'info',
    `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_lectura` DATETIME NULL,
    `usuario_id` INT NOT NULL,
    `post_id` INT NULL,
    CONSTRAINT `fk_notificaciones_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_notificaciones_post` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `suscripciones_categoria` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `fecha_suscripcion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `activa` TINYINT(1) NOT NULL DEFAULT 1,
    `usuario_id` INT NOT NULL,
    `categoria_id` INT NOT NULL,
    UNIQUE KEY `ux_suscripcion_usuario_categoria` (`usuario_id`, `categoria_id`),
    CONSTRAINT `fk_suscripciones_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_suscripciones_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- Datos iniciales: roles
INSERT IGNORE INTO `roles` (`nombre`) VALUES
    ('usuarios'),
    ('admin'),
    ('superUsuario');

-- Datos iniciales: permisos
INSERT IGNORE INTO `permisos` (`nombre`, `descripcion`) VALUES
    ('view_posts', 'Ver publicaciones'),
    ('create_posts', 'Crear publicaciones'),
    ('update_posts', 'Actualizar publicaciones'),
    ('delete_posts', 'Eliminar publicaciones'),
    ('view_convenios', 'Ver convenios'),
    ('manage_convenios', 'Gestionar convenios'),
    ('manage_categorias', 'Gestionar categorías'),
    ('view_notificaciones', 'Ver notificaciones'),
    ('manage_suscripciones', 'Gestionar suscripciones de categorías'),
    ('manage_roles', 'Gestionar roles y permisos');

-- Asignaciones de permisos por rol
INSERT IGNORE INTO `rol_permisos` (`rol_id`, `permiso_id`)
SELECT r.id, p.id
FROM `roles` r
JOIN `permisos` p ON p.nombre IN ('view_posts', 'view_convenios', 'view_notificaciones', 'manage_suscripciones')
WHERE r.nombre = 'usuarios';

INSERT IGNORE INTO `rol_permisos` (`rol_id`, `permiso_id`)
SELECT r.id, p.id
FROM `roles` r
JOIN `permisos` p ON p.nombre IN ('view_posts', 'create_posts', 'update_posts', 'delete_posts', 'view_convenios', 'manage_convenios', 'manage_categorias', 'view_notificaciones', 'manage_suscripciones')
WHERE r.nombre = 'admin';

INSERT IGNORE INTO `rol_permisos` (`rol_id`, `permiso_id`)
SELECT r.id, p.id
FROM `roles` r
JOIN `permisos` p ON p.nombre IN ('view_posts', 'create_posts', 'update_posts', 'delete_posts', 'view_convenios', 'manage_convenios', 'manage_categorias', 'view_notificaciones', 'manage_suscripciones', 'manage_roles')
WHERE r.nombre = 'superUsuario';

-- Configuraciones iniciales
INSERT IGNORE INTO `configuraciones` (`clave`, `valor`, `descripcion`) VALUES
    ('app_name', 'Nuestro Bienestar', 'Nombre de la plataforma'),
    ('default_notification_type', 'info', 'Tipo de notificación por defecto'),
    ('support_email', 'soporte@nuestronb.mx', 'Correo de soporte para la plataforma');

-- Categorías iniciales
INSERT IGNORE INTO `categorias` (`nombre`) VALUES
    ('Salud'),
    ('Bienestar'),
    ('Educación'),
    ('Tecnología');

-- Convenios iniciales
INSERT IGNORE INTO `convenios` (`nombre`) VALUES
    ('Gimnasio FitClub'),
    ('Clínica SaludPlus'),
    ('Librería EducaHoy'),
    ('Software de Productividad Pro');

-- Ejemplo de publicaciones semilla
INSERT IGNORE INTO `posts` (`titulo`, `descripcion`, `fecha_validez`, `categoria_id`) VALUES
    ('Descuento en gimnasio local', 'Acceso con 30% de descuento en el gimnasio FitClub para todos los usuarios.', '2026-12-31', (SELECT id FROM `categorias` WHERE nombre = 'Salud')),
    ('Becas de formación online', 'Cursos en línea con apoyo para formación continua y certificaciones.','2026-12-31', (SELECT id FROM `categorias` WHERE nombre = 'Educación'));

-- Relación de publicaciones con convenios
INSERT IGNORE INTO `post_convenios` (`post_id`, `convenio_id`)
SELECT p.id, c.id
FROM `posts` p
JOIN `convenios` c ON c.nombre = 'Gimnasio FitClub'
WHERE p.titulo = 'Descuento en gimnasio local';

INSERT IGNORE INTO `post_convenios` (`post_id`, `convenio_id`)
SELECT p.id, c.id
FROM `posts` p
JOIN `convenios` c ON c.nombre = 'Librería EducaHoy'
WHERE p.titulo = 'Becas de formación online';
