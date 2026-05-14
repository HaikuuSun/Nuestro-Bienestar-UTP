const socketio = require('socket.io');

let io;

exports.initializeSocket = (server) => {
    io = socketio(server, {
        cors: {
            // Permitir conexiones desde el frontend (Angular)
            origin: "http://localhost:4200",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`✅ Cliente conectado: ${socket.id}`);

        // Unir al usuario a su sala personal
        socket.on('registrar_usuario', (usuario_id) => {
            socket.join(`usuario_${usuario_id}`);
            console.log(`👤 Usuario ${usuario_id} registrado en sala: usuario_${usuario_id}`);
        });

        socket.on('disconnect', () => {
            console.log(`❌ Cliente desconectado: ${socket.id}`);
        });
    });

    return io;
};

exports.getIO = () => {
    if (!io) throw new Error('Socket.io no inicializado');
    return io;
};