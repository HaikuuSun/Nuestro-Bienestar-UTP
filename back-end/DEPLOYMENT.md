# Guía de Despliegue en AWS

## Resumen de Cambios Implementados

### ✅ Requisitos Completados

1. **API REST con mínimo 3 recursos** ✓
   - Usuarios
   - Categorías
   - Convenios
   - Posts
   - Suscripciones
   - Notificaciones

2. **CRUD Completo en 2 recursos** ✓
   - **Usuarios:** CREATE, READ, UPDATE, DELETE
   - **Categorías:** CREATE, READ, UPDATE, DELETE

3. **Variables de Entorno** ✓
   - `.env` creado con todas las variables
   - `.env.example` como plantilla

4. **Manejo de Errores** ✓
   - Middleware centralizado en `src/middlewares/error.middleware.js`
   - Códigos HTTP específicos
   - Manejo de errores Sequelize
   - Logging en desarrollo

5. **Respuestas con Códigos HTTP Correctos** ✓
   - 200 OK para GET, PUT, DELETE
   - 201 Created para POST
   - 400 Bad Request para datos inválidos
   - 401 Unauthorized para token faltante/expirado
   - 403 Forbidden para permisos insuficientes
   - 404 Not Found para recurso no encontrado
   - 409 Conflict para restricciones únicas
   - 500 Internal Server Error
   - 503 Service Unavailable

6. **CORS Configurado para AWS** ✓
   - Variables de entorno para orígenes
   - Métodos permitidos: GET, POST, PUT, DELETE, OPTIONS, PATCH
   - Headers: Content-Type, Authorization
   - Credenciales habilitadas

---

## Estructura del Proyecto Mejorada

```
back-end/
├── .env                      # Variables de entorno (desarrollo)
├── .env.example             # Plantilla de variables
├── API_DOCUMENTATION.md     # Documentación completa de APIs
├── DEPLOYMENT.md            # Este archivo
├── package.json             # Dependencias mejoradas
├── server.js                # Punto de entrada
└── src/
    ├── app.js               # Configuración Express con CORS y manejo de errores
    ├── config/
    │   ├── db.js           # Conexión MySQL
    │   ├── dotenv.js       # Configuración de variables
    │   ├── roles.js        # Roles de usuario
    │   └── socket.config.js
    ├── controllers/         # Controladores mejorados
    │   ├── usuario.controller.js    # ✓ Mejorado
    │   ├── categoria.controller.js  # ✓ Mejorado
    │   ├── auth.controller.js
    │   ├── post.controller.js
    │   ├── convenios.controller.js
    │   └── ...
    ├── middlewares/
    │   ├── error.middleware.js      # ✓ Mejorado
    │   └── auth.middleware.js
    ├── models/              # Modelos Sequelize
    ├── routes/
    │   ├── usuarios.routes.js       # ✓ Rutas ordenadas
    │   ├── categorias.routes.js     # ✓ Rutas ordenadas
    │   └── ...
    ├── services/            # Servicios de negocio
    └── ...
```

---

## Archivos Modificados

### 1. `.env` y `.env.example`
- Variables para MySQL (host, puerto, usuario, contraseña, base de datos)
- JWT_SECRET para autenticación
- CORS_ORIGIN para multi-origen
- AWS_REGION y credenciales AWS

### 2. `src/app.js`
- ✓ CORS configurado con opciones específicas
- ✓ Middleware de errores agregado
- ✓ Rutas de suscripciones y notificaciones incluidas
- ✓ Endpoint de health check agregado
- ✓ Support para URL encoded

### 3. `src/middlewares/error.middleware.js`
- ✓ Corrección de `console.err` → `console.error`
- ✓ Manejo específico de errores Sequelize
- ✓ Códigos HTTP apropiados
- ✓ Stack trace solo en desarrollo

### 4. `src/controllers/usuario.controller.js`
- ✓ Validación de entrada
- ✓ Códigos HTTP correctos
- ✓ Respuestas estructuradas con `success`
- ✓ Manejo de errores con `next(error)`
- ✓ JSDoc con documentación

### 5. `src/controllers/categoria.controller.js`
- ✓ Validación de entrada
- ✓ Códigos HTTP correctos
- ✓ Respuestas estructuradas
- ✓ Manejo centralizado de errores
- ✓ JSDoc con documentación

### 6. `src/routes/categorias.routes.js`
- ✓ Orden correcto de rutas (GET /todas antes de GET /:id)

### 7. `package.json`
- ✓ Descripción del proyecto
- ✓ Script de inicio para producción: `npm start`
- ✓ Motores especificados (Node.js >= 18)

---

## Despliegue en AWS

### Opción 1: AWS EC2 + RDS

#### Paso 1: Preparar Instancia EC2

```bash
# Conectar a la instancia EC2
ssh -i "tu-clave.pem" ec2-user@tu-instancia.compute.amazonaws.com

# Actualizar el sistema
sudo yum update -y

# Instalar Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Instalar Git
sudo yum install -y git

# Clonar el repositorio
git clone https://github.com/tu-usuario/nuestro-bienestar.git
cd nuestro-bienestar/back-end
```

#### Paso 2: Crear Base de Datos RDS

```bash
# En AWS Console:
# 1. RDS → Crear base de datos
# 2. Engine: MySQL 8.0
# 3. Instance: db.t3.micro
# 4. Almacenamiento: 20 GB
# 5. VPC Security Group: Permitir puerto 3306
# 6. Contraseña: Usar AWS Secrets Manager
```

#### Paso 3: Configurar Aplicación

```bash
# Instalar dependencias
npm install

# Crear archivo .env con variables de RDS
cat > .env << EOF
API_PORT=5000
NODE_ENV=production

DB_HOST=tu-rds-endpoint.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=tu_contraseña_segura
DB_NAME=nuestro_bienestar

JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

SOCKET_PORT=5001

CORS_ORIGIN=https://tu-dominio-frontend.com,https://www.tu-dominio-frontend.com

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
EOF
```

#### Paso 4: Usar PM2 para Procesos

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Crear aplicación con PM2
pm2 start server.js --name "nuestro-bienestar-api"

# Guardar configuración
pm2 save

# Hacer PM2 como servicio en el arranque
sudo pm2 startup

# Monitoreo
pm2 monit
```

#### Paso 5: Configurar Nginx como Reverse Proxy

```bash
# Instalar Nginx
sudo yum install -y nginx

# Crear configuración
sudo cat > /etc/nginx/conf.d/nuestro-bienestar.conf << EOF
upstream nuestro_bienestar_api {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Redirigir a HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;

    # Certificados SSL (usar ACM)
    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;

    client_max_body_size 10M;

    location /api/ {
        proxy_pass http://nuestro_bienestar_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        return 404;
    }
}
EOF

# Iniciar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

### Opción 2: AWS ECS (Containerizado)

#### Paso 1: Crear Dockerfile

```dockerfile
# back-end/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código
COPY . .

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/v1/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando de inicio
CMD ["node", "server.js"]
```

#### Paso 2: Crear ECR Repository

```bash
# Crear repositorio
aws ecr create-repository --repository-name nuestro-bienestar-api --region us-east-1

# Obtener URI
aws ecr describe-repositories --repository-names nuestro-bienestar-api --region us-east-1
```

#### Paso 3: Build y Push

```bash
# Login en ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Build
docker build -t nuestro-bienestar-api:latest ./back-end

# Tag
docker tag nuestro-bienestar-api:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/nuestro-bienestar-api:latest

# Push
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/nuestro-bienestar-api:latest
```

#### Paso 4: Crear Tarea ECS

En AWS Console:
1. ECS → Crear nueva definición de tarea
2. Compatible: FARGATE
3. Memoria: 512 MB, CPU: 256
4. Imagen: Tu URI de ECR
5. Puerto: 5000
6. Variables de entorno: Desde Secrets Manager

#### Paso 5: Crear Servicio ECS

1. ECS → Crear servicio
2. Lanzamiento: FARGATE
3. Réplicas: 2-4
4. Load Balancer: Application Load Balancer
5. Target Group: /api/v1/health

---

### Opción 3: AWS Lambda + API Gateway (Serverless)

```bash
# Instalar SAM CLI
brew install aws-sam-cli

# Crear template SAM
sam init --runtime nodejs18.x

# Configurar variables en AWS Secrets Manager
aws secretsmanager create-secret \
  --name nuestro-bienestar/db \
  --secret-string '{"host":"...","user":"admin","password":"..."}'

# Deploy
sam deploy --guided
```

---

## Monitoreo y Seguridad

### CloudWatch

```bash
# Crear log group
aws logs create-log-group --log-group-name /aws/nuestro-bienestar/api

# Ver logs
aws logs tail /aws/nuestro-bienestar/api --follow
```

### WAF (Web Application Firewall)

```bash
# Crear Web ACL
aws wafv2 create-web-acl \
  --name nuestro-bienestar-waf \
  --scope REGIONAL \
  --default-action Allow={}
```

### Backup de Base de Datos

```bash
# Habilitar automated backups en RDS
aws rds modify-db-instance \
  --db-instance-identifier nuestro-bienestar \
  --backup-retention-period 30 \
  --apply-immediately
```

---

## Variables de Entorno para AWS

```env
# Production (.env en AWS)
API_PORT=5000
NODE_ENV=production

# RDS MySQL
DB_HOST=nuestro-bienestar.c123456.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=TuContraseñaSegura123!
DB_NAME=nuestro_bienestar

# JWT (generar con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz

# Socket IO
SOCKET_PORT=5001

# CORS para Frontend en AWS
CORS_ORIGIN=https://nuestro-bienestar.com,https://www.nuestro-bienestar.com

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

---

## Verificación Post-Despliegue

```bash
# Health Check
curl https://tu-dominio.com/api/v1/health

# Test Login
curl -X POST https://tu-dominio.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@example.com","contrasena":"password"}'

# Test CORS
curl -i -X OPTIONS https://tu-dominio.com/api/v1/usuarios \
  -H "Origin: https://tu-frontend.com" \
  -H "Access-Control-Request-Method: GET"

# Verificar variables
echo $NODE_ENV  # Debe mostrar: production
```

---

## Troubleshooting

### Error: "CORS block"
- Verificar `CORS_ORIGIN` en `.env`
- Asegurar que el frontend URL coincide exactamente

### Error: "Can't connect to database"
- Verificar Security Group de RDS
- Verificar credenciales de DB
- Verificar VPC y subnet

### Error: "JWT secret not found"
- Regenerar con: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Actualizar en AWS Secrets Manager

### Performance lento
- Aumentar recursos EC2/ECS
- Habilitar RDS read replicas
- Configurar CloudFront cache

---

## Checklist de Seguridad

- [ ] JWT_SECRET es una cadena segura y aleatoria
- [ ] Contraseña RDS es fuerte (mín 16 caracteres)
- [ ] Security Groups restringen acceso
- [ ] SSL/HTTPS está habilitado
- [ ] CORS_ORIGIN especifica orígenes válidos
- [ ] NODE_ENV=production en AWS
- [ ] Logs enviados a CloudWatch
- [ ] Backups automáticos de RDS
- [ ] WAF está activo
- [ ] Access Keys rotadas regularmente

---

## Recursos Útiles

- [AWS Best Practices](https://docs.aws.amazon.com/general/latest/gr/aws-security-audit-guide.html)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [Sequelize MySQL](https://sequelize.org/docs/v6/getting-started/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Versión:** 1.0
**Actualizado:** Mayo 15, 2026
