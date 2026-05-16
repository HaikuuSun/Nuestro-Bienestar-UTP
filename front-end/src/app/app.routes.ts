import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./registro/registro.component').then(m => m.RegistroComponent) },
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'categorias', loadComponent: () => import('./categorias/categorias.component').then(m => m.CategoriasComponent) },
  { path: 'convenios', loadComponent: () => import('./convenios/convenios.component').then(m => m.ConveniosComponent) },
  { path: 'beneficios', loadComponent: () => import('./beneficios/beneficios.component').then(m => m.BeneficiosComponent) },
  { path: 'perfil', loadComponent: () => import('./perfil/perfil.component').then(m => m.PerfilComponent) },
  { path: 'notificaciones', loadComponent: () => import('./notificaciones/notificaciones.component').then(m => m.NotificacionesComponent) },
  { path: 'about', loadComponent: () => import('./about/about.component').then(m => m.AboutComponent) },
  { path: '**', redirectTo: '/home' }
];