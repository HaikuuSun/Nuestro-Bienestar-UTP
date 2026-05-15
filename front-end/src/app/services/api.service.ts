import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api/v1';

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
