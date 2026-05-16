import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: any = null;
  nombre = '';
  correo = '';
  celular = '';
  contrasena = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.apiService.getMyProfile().subscribe({
      next: (response) => {
        this.user = response.data || response;
        this.nombre = this.user.nombre || '';
        this.correo = this.user.correo || '';
        this.celular = this.user.celular || '';
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }

  actualizarPerfil(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.nombre || !this.correo) {
      this.errorMessage = 'Nombre y correo son obligatorios.';
      return;
    }

    if (!this.correo.endsWith('@utp.edu.co')) {
      this.errorMessage = 'El correo debe terminar en @utp.edu.co.';
      return;
    }

    this.loading = true;
    const payload: any = {
      nombre: this.nombre,
      correo: this.correo,
      celular: this.celular || null
    };

    if (this.contrasena) {
      payload.contrasena = this.contrasena;
    }

    this.apiService.updateProfile(this.user.id, payload).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Perfil actualizado correctamente.';
        this.user = response.data || response;
        this.authService.setUser(this.user);
        this.contrasena = '';
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }
}
