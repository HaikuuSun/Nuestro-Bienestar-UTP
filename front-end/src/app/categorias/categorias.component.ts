import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  nombre: string = '';
  categorias: any[] = [];
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
    this.loading = true;
    this.errorMessage = '';
    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categorias = response || [];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }

  crearCategoria(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'El nombre de la categoría es obligatorio.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.createCategory(this.nombre.trim()).subscribe({
      next: (response) => {
        this.successMessage = 'Categoría creada correctamente.';
        this.nombre = '';
        this.saving = false;
        this.loadCategorias();
      },
      error: (error) => {
        this.errorMessage = error;
        this.saving = false;
      }
    });
  }

  eliminarCategoria(id: number) {
    this.loading = true;
    this.errorMessage = '';
    this.apiService.deleteCategory(id).subscribe({
      next: () => {
        this.successMessage = 'Categoría eliminada correctamente.';
        this.loadCategorias();
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }
}
