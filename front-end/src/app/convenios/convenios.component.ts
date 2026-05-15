import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-convenios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convenios.component.html',
  styleUrls: ['./convenios.component.css']
})
export class ConveniosComponent implements OnInit {
  convenios: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadConvenios();
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
}
