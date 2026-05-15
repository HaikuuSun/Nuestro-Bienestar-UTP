# Documentación de Recursos de la API REST

## Descripción General

El backend de **Nuestro Bienestar** es una API REST construida con Express.js, MySQL y Sequelize, diseñada para gestionar una plataforma de bienestar con soporte para usuarios, categorías, convenios, posts, suscripciones y notificaciones.

**Base URL en Desarrollo:** `http://localhost:5000/api/v1`
**Base URL en Producción (AWS):** Se configurará según el dominio

---

## Requisitos Cumplidos

✅ **API REST con mínimo 3 recursos:** 6 recursos disponibles
- Usuarios
- Categorías
- Convenios
- Posts
- Suscripciones
- Notificaciones

✅ **CRUD completo en al menos 2 recursos:**
- **Usuarios:** CREATE (POST), READ (GET), UPDATE (PUT), DELETE (DELETE)
- **Categorías:** CREATE (POST), READ (GET), UPDATE (PUT), DELETE (DELETE)

✅ **Variables de entorno:** `.env` configurado con todas las variables necesarias

✅ **Manejo de errores:** Middleware centralizado de errores en `src/middlewares/error.middleware.js`

✅ **Códigos HTTP correctos:** Implementados en todos los controladores

✅ **CORS configurado:** Habilitado para desarrollo y listo para AWS

---

## Recursos (Endpoints)

### 1. **Autenticación** 
**Prefijo:** `/api/v1/auth`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---|
| POST | `/login` | Iniciar sesión | No |
| POST | `/logout` | Cerrar sesión | Sí |
| POST | `/refresh` | Renovar token | Sí |

---

### 2. **Usuarios** (CRUD Completo)
**Prefijo:** `/api/v1/usuarios`

#### Crear Usuario
```
POST /registro
Autenticación: Requerida (solo ADMIN)
```
**Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "celular": "3001234567",
  "contrasena": "password123",
  "rol_id": 2
}
```
**Respuesta (201 Created):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": { /* usuario */ }
}
```

#### Leer Todos los Usuarios por Rol
```
GET /filtro-roles?rol_id=2
Autenticación: Requerida (ADMIN o COORDINADOR)
```

#### Leer Usuario por ID
```
GET /:id
Autenticación: Requerida (ADMIN o COORDINADOR)
```

#### Leer Mi Perfil
```
GET /mi-perfil
Autenticación: Requerida (cualquier usuario)
```

#### Actualizar Usuario
```
PUT /actualizar/:id
Autenticación: Requerida (propietario o ADMIN)
```
**Body:**
```json
{
  "nombre": "Juan Actualizado",
  "correo": "juan.new@example.com",
  "celular": "3009876543",
  "contrasena": "newpassword123"
}
```

#### Eliminar Usuario
```
DELETE /eliminar/:id
Autenticación: Requerida (solo ADMIN)
```

---

### 3. **Categorías** (CRUD Completo)
**Prefijo:** `/api/v1/categorias`

#### Crear Categoría
```
POST /crear
Autenticación: Requerida (solo ADMIN)
```
**Body:**
```json
{
  "nombre": "Salud Mental"
}
```
**Respuesta (201 Created):**
```json
{
  "success": true,
  "message": "Categoría creada exitosamente",
  "data": { /* categoría */ }
}
```

#### Leer Todas las Categorías
```
GET /todas
Autenticación: Requerida (cualquier usuario)
```

#### Leer Categoría por ID
```
GET /:id
Autenticación: Requerida (cualquier usuario)
```

#### Actualizar Categoría
```
PUT /actualizar/:id
Autenticación: Requerida (solo ADMIN)
```
**Body:**
```json
{
  "nombre": "Bienestar Mental"
}
```

#### Eliminar Categoría
```
DELETE /eliminar/:id
Autenticación: Requerida (solo ADMIN)
```

---

### 4. **Convenios**
**Prefijo:** `/api/v1/convenios`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---|
| POST | `/crear` | Crear convenio | Sí (ADMIN) |
| GET | `/:id` | Obtener convenio | Sí |
| GET | `/todos` | Listar convenios | Sí |
| PUT | `/actualizar/:id` | Actualizar convenio | Sí (ADMIN) |
| DELETE | `/eliminar/:id` | Eliminar convenio | Sí (ADMIN) |

---

### 5. **Posts**
**Prefijo:** `/api/v1/posts`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---|
| POST | `/crear` | Crear post | Sí |
| GET | `/:id` | Obtener post | Sí |
| GET | `/todos` | Listar posts | Sí |
| PUT | `/actualizar/:id` | Actualizar post | Sí (propietario o ADMIN) |
| DELETE | `/eliminar/:id` | Eliminar post | Sí (propietario o ADMIN) |

---

### 6. **Suscripciones**
**Prefijo:** `/api/v1/suscripciones`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---|
| POST | `/crear` | Suscribirse a categoría | Sí |
| GET | `/mis-suscripciones` | Obtener mis suscripciones | Sí |
| DELETE | `/eliminar/:id` | Desuscribirse | Sí |

---

### 7. **Notificaciones**
**Prefijo:** `/api/v1/notificaciones`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---|
| GET | `/mis-notificaciones` | Obtener mis notificaciones | Sí |
| PUT | `/marcar-leida/:id` | Marcar como leída | Sí |
| DELETE | `/eliminar/:id` | Eliminar notificación | Sí |

---

### 8. **Health Check**
**Prefijo:** `/api/v1/health`

```
GET /health
Autenticación: No requerida
```
**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2026-05-15T10:30:00Z"
}
```

---

## Códigos HTTP Utilizados

| Código | Significado | Casos de Uso |
|--------|------------|---|
| 200 | OK | Solicitud exitosa (GET, PUT, DELETE) |
| 201 | Created | Recurso creado exitosamente (POST) |
| 400 | Bad Request | Datos inválidos o campos faltantes |
| 401 | Unauthorized | Token faltante o expirado |
| 403 | Forbidden | Token inválido o permisos insuficientes |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | El recurso ya existe (restricción única) |
| 500 | Internal Server Error | Error en el servidor |
| 503 | Service Unavailable | Base de datos no disponible |

---

## Manejo de Errores

Todos los errores siguen este formato:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Descripción del error",
  "error": "Stack trace (solo en desarrollo)"
}
```

**Middleware de Errores:** `src/middlewares/error.middleware.js`
- Captura automáticamente errores de Sequelize
- Proporciona códigos HTTP específicos
- Loguea errores en consola
- Oculta detalles técnicos en producción

---

## Middleware de CORS

**Archivo:** `src/app.js`

**Configuración:**
- **Orígenes permitidos:** Variables de entorno `CORS_ORIGIN` (desarrollo: localhost:4200, localhost:3000)
- **Métodos permitidos:** GET, POST, PUT, DELETE, OPTIONS, PATCH
- **Headers permitidos:** Content-Type, Authorization
- **Credenciales:** Habilitadas

**Para AWS:**
1. Agregar el dominio frontend a la variable `CORS_ORIGIN` en `.env`
2. Ejemplo: `CORS_ORIGIN=https://app.ejemplo.com,https://admin.ejemplo.com`

---

## Autenticación

**Tipo:** JWT (JSON Web Token)

**Header requerido:**
```
Authorization: Bearer <token>
```

**Token contiene:**
- `id`: ID del usuario
- `correo`: Email del usuario
- `rol`: Rol del usuario (ADMIN, COORDINADOR, USUARIO)

**Middleware de Autenticación:** `src/middlewares/auth.middleware.js`

---

## Variables de Entorno

**Archivo:** `.env`

```env
# API
API_PORT=5000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=nuestro_bienestar

# JWT
JWT_SECRET=a7f3e8b2c1d9f4e6a5b8c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1

# Socket IO
SOCKET_PORT=5001

# CORS
CORS_ORIGIN=http://localhost:4200,http://localhost:3000

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

---

## Instalación y Configuración

### Requisitos
- Node.js v18+
- MySQL 5.7+

### Pasos

1. **Instalar dependencias:**
```bash
cd back-end
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

3. **Ejecutar en desarrollo:**
```bash
npm run dev
```

4. **API disponible en:**
```
http://localhost:5000/api/v1
```

---

## Despliegue en AWS

### Opción 1: EC2 + RDS

1. **EC2:** Ejecutar aplicación Node.js
2. **RDS:** Base de datos MySQL administrada
3. **CloudFront/ALB:** Distribuir tráfico

### Opción 2: ECS + RDS

1. **ECS:** Containerizar con Docker
2. **RDS:** Base de datos MySQL
3. **Application Load Balancer:** Balanceo de carga

### Variables de Entorno en AWS

Usar **AWS Secrets Manager** o **Parameter Store:**

```bash
# Guardar en Secrets Manager
aws secretsmanager create-secret \
  --name nuestro-bienestar/api \
  --secret-string '{"DB_HOST":"rds-endpoint","DB_USER":"admin",...}'
```

---

## Testing

### Herramientas Recomendadas
- **Postman:** Colección de endpoints disponible
- **Insomnia:** Cliente REST alternativo
- **cURL:** Línea de comandos

### Ejemplo con cURL

```bash
# Obtener token de autenticación
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@example.com","contrasena":"password123"}'

# Crear categoría
curl -X POST http://localhost:5000/api/v1/categorias/crear \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"nombre":"Salud Mental"}'
```

---

## Estructura del Proyecto

```
back-end/
├── server.js                 # Punto de entrada
├── .env                      # Variables de entorno
├── .env.example             # Plantilla de variables
├── package.json
└── src/
    ├── app.js               # Configuración de Express
    ├── config/
    │   ├── db.js           # Conexión a DB
    │   ├── dotenv.js       # Configuración de dotenv
    │   ├── roles.js        # Definición de roles
    │   └── socket.config.js # Socket.io config
    ├── controllers/         # Lógica de negocio
    ├── middlewares/         # Autenticación y errores
    ├── models/              # Modelos Sequelize
    ├── routes/              # Definición de rutas
    ├── services/            # Servicios reutilizables
    └── ...
```

---

## Notas

- **Seguridad:** Las contraseñas están hasheadas con bcrypt
- **Validaciones:** Implementadas en controladores
- **Errores:** Manejados de forma centralizada
- **CORS:** Configurado para múltiples orígenes
- **JWT:** Token expira según configuración
- **RLS:** Control de acceso basado en roles

---

**Última actualización:** Mayo 15, 2026
