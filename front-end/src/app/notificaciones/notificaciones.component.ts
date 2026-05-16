import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  notifications: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.errorMessage = '';
    this.apiService.getNotifications().subscribe({
      next: (response) => {
        this.notifications = response || [];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }

  marcarLeida(id: number): void {
    this.apiService.markNotificationRead(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter((notification) => notification.id !== id);
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });
  }
}
