const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const SUPER_USER_CORREO = process.env.SUPER_USER_CORREO || 'superadmin@bienestar.com';
const SUPER_USER_NOMBRE = process.env.SUPER_USER_NOMBRE || 'Super Admin';
const SUPER_USER_CONTRASENA = process.env.SUPER_USER_CONTRASENA || 'Admin123456';

async function seedSuperUser() {
  let connection;
  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nuestro_bienestar'
    });

    console.log('[seedSuperUser] Conectado a la base de datos');

    // Verificar si el super usuario ya existe
    const [existingUser] = await connection.query(
      'SELECT id FROM usuarios WHERE correo = ?',
      [SUPER_USER_CORREO]
    );

    if (existingUser.length > 0) {
      console.log('[seedSuperUser] El super usuario ya existe en la base de datos');
      return;
    }

    // Obtener el ID del rol 'superUsuario'
    const [roles] = await connection.query(
      'SELECT id FROM roles WHERE nombre = ?',
      ['superUsuario']
    );

    if (roles.length === 0) {
      console.error('[seedSuperUser] El rol "superUsuario" no existe. Ejecuta el script de seeding principal primero.');
      process.exit(1);
    }

    const rolId = roles[0].id;

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(SUPER_USER_CONTRASENA, 10);

    // Insertar el super usuario
    await connection.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, rol_id) VALUES (?, ?, ?, ?)',
      [SUPER_USER_NOMBRE, SUPER_USER_CORREO, hashedPassword, rolId]
    );

    console.log('[seedSuperUser] ✅ Super usuario creado exitosamente');
    console.log(`Email: ${SUPER_USER_CORREO}`);
    console.log(`Contraseña: ${SUPER_USER_CONTRASENA}`);
    console.log('[seedSuperUser] IMPORTANTE: Cambia esta contraseña después del primer login');

  } catch (error) {
    console.error('[seedSuperUser] ❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedSuperUser();
