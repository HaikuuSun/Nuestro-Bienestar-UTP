import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;

  connect(): void {
    if (this.socket && this.socket.connected) {
      return;
    }

    const token = localStorage.getItem('token') || '';
    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
      auth: {
        token
      },
      withCredentials: true
    });
  }

  registrarUsuario(usuarioId: number): void {
    if (!this.socket) {
      this.connect();
    }
    this.socket?.emit('registrar_usuario', usuarioId);
  }

  escucharNotificaciones(callback: (data: any) => void): void {
    if (!this.socket) {
      this.connect();
    }
    this.socket?.on('nueva_notificacion', callback);
  }

  desconectar(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}