import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private api: ApiService) {}

  login(correo: string, contrasena: string): Observable<any> {
    return this.api.login(correo, contrasena).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.usuario));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): any {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  isSuperUsuario(): boolean {
    return this.getUser()?.rol === 'superUsuario';
  }

  isAdmin(): boolean {
    return this.getUser()?.rol === 'admin';
  }

  isCoordinador(): boolean {
    return this.getUser()?.rol === 'coordinador';
  }

  canManageConvenios(): boolean {
    const rol = this.getUser()?.rol;
    return rol === 'admin' || rol === 'coordinador' || rol === 'superUsuario';
  }

  canManagePosts(): boolean {
    const rol = this.getUser()?.rol;
    return rol === 'admin' || rol === 'superUsuario';
  }

  canManageCategories(): boolean {
    const rol = this.getUser()?.rol;
    return rol === 'admin' || rol === 'superUsuario';
  }
}
