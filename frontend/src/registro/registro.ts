import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  nuevoUsuario = {
    nombre: '',
    email: '',
    password: '',
    fechaNacimiento: '', // Aquí se guardará el valor del calendario (YYYY-MM-DD)
    telefono: ''
  };
  confirmarPass = '';
  showPassword = false;


  async enviarRegistro() {
    const { nombre, email, password, fechaNacimiento, telefono } = this.nuevoUsuario;

    // 1. Validar que TODO esté lleno
  if (!nombre || !email || !password || !fechaNacimiento || !telefono) {
    alert('Todos los campos son obligatorios.');
    return;
  }
  // 2. Validar contraseñas
    if (this.nuevoUsuario.password !== this.confirmarPass) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // 3. Intentar registro
  const exito = await this.authService.register(this.nuevoUsuario);
  console.log('Registrando nuevo usuario:', this.nuevoUsuario);

  if (exito) {
    alert('¡Registro completado!');
    this.router.navigate(['/login']);
  } else {
    alert('Error al registrar. Inténtalo de nuevo.');
  }
}
  irALogin() {
    this.router.navigate(['/login']);
  }
}

