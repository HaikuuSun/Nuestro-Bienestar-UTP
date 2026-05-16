import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  nombre = '';
  correo = '';
  celular = '';
  contrasena = '';
  rol = 'usuarios';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.authService.isSuperUsuario()) {
      this.router.navigate(['/home']);
      return;
    }
  }

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.nombre || !this.correo || !this.contrasena) {
      this.errorMessage = 'Nombre, correo y contraseña son obligatorios.';
      return;
    }

    if (!this.correo.endsWith('@utp.edu.co')) {
      this.errorMessage = 'El correo debe terminar en @utp.edu.co.';
      return;
    }

    if (this.contrasena.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.loading = true;
    this.apiService.registerUser(this.nombre, this.correo, this.celular || null, this.contrasena, this.rol)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = response.message || 'Usuario registrado correctamente.';
          this.nombre = '';
          this.correo = '';
          this.celular = '';
          this.contrasena = '';
          this.rol = 'usuarios';
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error;
        }
      });
  }
}
