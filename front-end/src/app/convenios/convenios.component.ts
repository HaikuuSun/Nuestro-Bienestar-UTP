import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-convenios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './convenios.component.html',
  styleUrls: ['./convenios.component.css']
})
export class ConveniosComponent implements OnInit {
  convenios: any[] = [];
  nombre = '';
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit() {
    this.loadConvenios();
  }

  get canManageConvenios(): boolean {
    return this.authService.canManageConvenios();
  }

  loadConvenios() {
    this.loading = true;
    this.errorMessage = '';
    this.apiService.getConvenios().subscribe({
      next: (response) => {
        this.convenios = response || [];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }

  crearConvenio() {
    if (!this.nombre.trim()) {
      this.errorMessage = 'El nombre del convenio es obligatorio.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.createConvenio(this.nombre.trim()).subscribe({
      next: () => {
        this.successMessage = 'Convenio creado correctamente.';
        this.nombre = '';
        this.saving = false;
        this.loadConvenios();
      },
      error: (error) => {
        this.errorMessage = error;
        this.saving = false;
      }
    });
  }

  eliminarConvenio(id: number) {
    if (!confirm('¿Eliminar este convenio?')) {
      return;
    }

    this.loading = true;
    this.apiService.deleteConvenio(id).subscribe({
      next: () => {
        this.successMessage = 'Convenio eliminado correctamente.';
        this.loadConvenios();
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }
}
