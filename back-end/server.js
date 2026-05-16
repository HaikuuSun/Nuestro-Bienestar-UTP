const http = require('http');
const sequelize = require('./src/config/db');
const app = require('./src/app');
const dotenv = require('dotenv');
const { initializeSocket } = require('./src/config/socket.config');
require('./src/models/associations');

dotenv.config();

const PORT = process.env.API_PORT;
const server = http.createServer(app);

// Verificar la conexión a la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('[MySQL] Base de datos conectada');
        initializeSocket(server);
        server.listen(PORT, () => {
            console.log(`[Express] Servidor ejecutándose en http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('[MySQL] Error conectando a la base de datos: ', err));

// Sincronizar la base de datos
sequelize.sync({force: false}).then(() => {
    console.log('[MySQL] Base de datos sincronizada');
}).catch(err => {
    console.error('[MySQL] Error al sincronizar la base de datos: ', err);
});