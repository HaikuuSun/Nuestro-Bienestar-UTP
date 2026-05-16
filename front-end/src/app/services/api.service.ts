import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      })
    };
  }

  private handleError(error: any) {
    return throwError(() => error.error?.message || error.message || 'Error en la comunicación con el servidor.');
  }

  login(correo: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { correo, contrasena }).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  registerUser(nombre: string, correo: string, celular: string | null, contrasena: string, rol: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/registro`, { nombre, correo, celular, contrasena, rol }, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  getMyProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/mi-perfil`, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  updateProfile(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/actualizar/${id}`, datos, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  getPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts/todos`, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  createPost(titulo: string, descripcion: string, fecha_validez: string, categoria_id: number, ids_convenios: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts/crear`, { titulo, descripcion, fecha_validez, categoria_id, ids_convenios }, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/eliminar/${id}`, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  createConvenio(nombre: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/convenios/crear`, { nombre }, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  deleteConvenio(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/convenios/eliminar/${id}`, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  getNotifications(): Observable<any> {
    return this.http.get(`${this.baseUrl}/notificaciones`, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  markNotificationRead(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/notificaciones/${id}/leida`, {}, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorias/todas`, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  createCategory(nombre: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/categorias/crear`, { nombre }, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categorias/eliminar/${id}`, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  getConvenios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/convenios/todos`, this.getHeaders()).pipe(
      catchError((error) => this.handleError(error))
    );
  }
}
