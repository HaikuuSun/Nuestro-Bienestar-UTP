const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const SQL_FILE = path.join(__dirname, 'seeders', 'init_schema_and_seed.sql');
const RETRIES = 12;
const RETRY_DELAY = 5000;

async function waitForDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  };

  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    try {
      const connection = await mysql.createConnection(config);
      await connection.ping();
      await connection.end();
      return;
    } catch (err) {
      const remaining = RETRIES - attempt;
      console.log(`[seed] Esperando MySQL (${attempt}/${RETRIES})... ${remaining} intentos restantes`);
      if (attempt === RETRIES) {
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

async function runSeed() {
  await waitForDatabase();

  const sql = fs.readFileSync(SQL_FILE, 'utf8');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    await connection.query(sql);
    console.log('[seed] Seeders ejecutados correctamente');
  } finally {
    await connection.end();
  }
}

runSeed().catch(err => {
  console.error('[seed] Error ejecutando los seeders:', err);
  process.exit(1);
});
