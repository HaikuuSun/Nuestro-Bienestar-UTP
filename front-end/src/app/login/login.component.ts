import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.email.endsWith('@utp.edu.co')) {
      this.router.navigate(['/home']);
    } else {
      alert('Correo no válido. Debe ser @utp.edu.co');
    }
  }
}
