import { io, Socket } from 'socket.io-client';

export class SocketService {
    private socket: Socket;
    
    constructor() {
        // Conectar hacia el backend (Express)
        this.socket = io('http://localhost:3000', {
            transports: ['websocket'], // Mejora en rendimiento
            auth: {
                // Enviar token para autenticación
                token: localStorage.getItem('jwt_token')
            }
        });
    }

    registrarUsuario(usuarioId: number): void {
        this.socket.emit('registrar_usuario', usuarioId);
    }

    escucharNotificaciones(callback: (data: any) => void): void {
        this.socket.on('nueva_notificacion', callback);
    }

    desconectar(): void {
        this.socket.disconnect();
    }

    getSocket(): Socket {
        return this.socket;
    }
}