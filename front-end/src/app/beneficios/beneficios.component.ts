import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-beneficios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.css']
})
export class BeneficiosComponent implements OnInit {
  posts: any[] = [];
  categorias: any[] = [];
  convenios: any[] = [];
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  titulo = '';
  descripcion = '';
  fecha_validez = '';
  categoria_id: number | null = null;
  ids_convenios: number[] = [];

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPosts();
    this.loadCategorias();
    this.loadConvenios();
  }

  get canManagePosts(): boolean {
    return this.authService.canManagePosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.apiService.getPosts().subscribe({
      next: (response) => {
        this.posts = response || [];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }

  loadCategorias(): void {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categorias = response.data || response || [];
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  loadConvenios(): void {
    this.apiService.getConvenios().subscribe({
      next: (response) => {
        this.convenios = response || [];
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  createBenefit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.titulo || !this.descripcion || !this.fecha_validez || !this.categoria_id) {
      this.errorMessage = 'Título, descripción, fecha y categoría son obligatorios.';
      return;
    }

    this.saving = true;
    this.apiService.createPost(this.titulo, this.descripcion, this.fecha_validez, this.categoria_id, this.ids_convenios)
      .subscribe({
        next: () => {
          this.successMessage = 'Beneficio creado correctamente.';
          this.titulo = '';
          this.descripcion = '';
          this.fecha_validez = '';
          this.categoria_id = null;
          this.ids_convenios = [];
          this.saving = false;
          this.loadPosts();
        },
        error: (error) => {
          this.errorMessage = error;
          this.saving = false;
        }
      });
  }

  eliminarPost(id: number): void {
    if (!confirm('¿Deseas eliminar este beneficio?')) {
      return;
    }

    this.loading = true;
    this.apiService.deletePost(id).subscribe({
      next: () => {
        this.successMessage = 'Beneficio eliminado correctamente.';
        this.loadPosts();
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }

  toggleConvenio(id: number): void {
    const index = this.ids_convenios.indexOf(id);
    if (index >= 0) {
      this.ids_convenios.splice(index, 1);
    } else {
      this.ids_convenios.push(id);
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
