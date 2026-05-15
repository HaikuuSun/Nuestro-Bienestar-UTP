import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent {
  notifications = [
    { id: 1, title: 'Nueva oferta de salud', message: 'Revisa el convenio de servicios médicos gratuitos.' },
    { id: 2, title: 'Capacitación disponible', message: 'Hay un nuevo curso de bienestar emocional en línea.' },
    { id: 3, title: 'Evento deportivo', message: 'Inscríbete al torneo universitario de fútbol sala.' }
  ];
}
