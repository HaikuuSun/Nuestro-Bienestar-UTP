# Proyecto Web Full-Stack

## Descripción

Este proyecto es un sistema web full-stack para la Universidad Tecnológica de Pereira (UTP). Incluye:

- Front-end en Angular con navegación, autenticación, vistas modernas y consumo de la API propia.
- Back-end en Express + Node.js con base de datos MySQL y autenticación JWT.
- Soporte para desarrollo local y despliegue en AWS.

## Estructura del repositorio

- `/back-end`: API REST con rutas, controladores, servicios, modelos y middleware.
- `/front-end`: aplicación Angular con múltiples vistas, navbar global, estados de carga y formulario validado.

## Requisitos

- Node.js `18.x` o superior
- npm `9.x` o superior
- Angular CLI (opcional, pero recomendado): `npm install -g @angular/cli`
- MySQL Server en local o en AWS RDS

---

## Configuración local

### Backend

1. Entra en la carpeta del backend:

```bash
cd back-end
```

2. Instala dependencias:

```bash
npm install
```

3. Crea el archivo de variables de entorno:

```bash
cp .env.example .env
```

4. Edita `back-end/.env` con los datos de tu base de datos local:

```env
API_PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=nuestro_bienestar
JWT_SECRET=clave_secreta_local
CORS_ORIGIN=http://localhost:4200
NODE_ENV=development
```

5. Inicia el backend en modo desarrollo:

```bash
npm run dev
```

6. Verifica que la API esté disponible en:

```text
http://localhost:5000/api/v1/health
```

### Frontend

1. Entra en la carpeta del frontend:

```bash
cd front-end
```

2. Instala dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm start
```

4. Abre la aplicación en:

```text
http://localhost:4200
```

---

## Detalles del frontend

- Se usa `Times New Roman` como fuente principal.
- Se agrega el logo de la Universidad Tecnológica de Pereira en la parte superior de la barra de navegación.
- Navegación con navbar presente en todas las páginas.
- Múltiples vistas con estados de carga y mensajes de error.
- Formulario de login con validación y feedback.

---

## Cambios de código para producción en AWS

### Backend (AWS)

1. En `back-end/.env`, reemplaza los valores locales por los de AWS RDS y tu dominio de frontend:

```env
API_PORT=5000
DB_HOST=tu-endpoint-rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=tu_contraseña_segura
DB_NAME=nuestro_bienestar
JWT_SECRET=clave_secreta_produccion
CORS_ORIGIN=https://tu-frontend.com
NODE_ENV=production
```

2. Asegúrate de que el Security Group del RDS permita conexiones desde el backend o desde la VPC correcta.

3. En producción, el backend debe correr con `NODE_ENV=production` y preferiblemente con un proceso manager como `pm2`.

### Frontend (AWS)

1. Cambia la URL de la API en `front-end/src/environments/environment.prod.ts` a tu API desplegada en AWS:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://api.tu-dominio.com/api/v1'
};
```

2. El frontend usa esa configuración en `front-end/src/app/services/api.service.ts`.

3. Para construir el frontend en modo producción:

```bash
cd front-end
ng build --configuration production
```

4. Despliega el contenido de `dist/front-end` en tu hosting o en un bucket S3 + CloudFront.

---

## Resumen de comandos útiles

```bash
# Backend local
cd back-end
npm install
cp .env.example .env
npm run dev

# Frontend local
cd front-end
npm install
npm start

# Build frontend producción
cd front-end
ng build --configuration production
```

---

## Notas importantes

- El backend ya está configurado para leer variables de entorno desde `.env`.
- El frontend utiliza archivos `environment.ts` y `environment.prod.ts` para la URL de la API.
- Para producción en AWS, siempre reemplaza los valores de `.env` con datos reales a nivel de servidor y asegúrate de no subir `.env` a Git.
- Si usas AWS S3 o CloudFront, configura el endpoint de la API en `environment.prod.ts` y habilita CORS en el backend.
