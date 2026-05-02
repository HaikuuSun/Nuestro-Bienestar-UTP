# Proyecto Web Full-Stack

## Descripción

Este proyecto incluye un front-end en Angular con páginas de login e inicio, un back-end en Express y Node.js, y una base de datos MySQL. Es para administrativos de la UTP con correos @utp.edu.co, mostrando beneficios universitarios.

## Requisitos

- Node.js (versión 18 o superior)
- Angular CLI: `npm install -g @angular/cli`
- MySQL Server instalado y corriendo

## Instalación

1. Clona o descarga el proyecto.
2. Para el back-end: `cd back-end && npm install`
3. Para el front-end: `cd front-end && npm install`
4. Configura MySQL: Crea una base de datos llamada 'test', y una tabla 'users' con columnas id (INT AUTO_INCREMENT PRIMARY KEY), name (VARCHAR(255)), etc.

## Ejecutar

- Back-end: `cd back-end && node server.js` (corre en http://localhost:3000)
- Front-end: `cd front-end && ng serve` (corre en http://localhost:4200)

## Notas

- Cambia las credenciales de MySQL en `back-end/server.js`
- Para "Live Server", `ng serve` proporciona un servidor de desarrollo con recarga automática.