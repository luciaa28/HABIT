import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  // Inyectamos lo necesario
  private authService = inject(AuthService);
  private router = inject(Router);

  // Variables para el formulario
  username = '';
  password = '';
  recordar = false;
  showPassword = false;

  // Se ejecuta al abrir el componente
  ngOnInit() {
    // --- LÓGICA DE RECUPERACIÓN CORREGIDA ---

    // 1. Intentamos recuperar el email persistente (el que NO se borra al cerrar sesión)
    const recordado = localStorage.getItem('email_recordado');
    //const passGuardada = localStorage.getItem('usuario_password'); // <-- Recuperar contraseña guardada

    if (recordado) {
      this.username = recordado;
      this.recordar = true;

      // if (passGuardada) {
      //   this.password = passGuardada;
      // }
    }
  }

  async enviarLogin() {
    // 1. Validar que no estén vacíos
    if (!this.username || !this.password) {
      alert('Por favor, rellena todos los campos.');
      return;
    }

    console.log('Intentando login con:', this.username, this.password); // Para depurar
    const esValido = await this.authService.login(this.username, this.password);

    if (esValido) {
      // 1. LLAVE DE SEGURIDAD (Se borra al cerrar sesión en habitaciones.ts)
      localStorage.setItem('sesion_activa', 'true');

      // 2. CORREO DEL USUARIO (Para mostrar en el menú de perfil)
      localStorage.setItem('usuario_email', this.username);
      // localStorage.setItem('usuario_password', this.password); // <-- Guardar contraseña si fuera necesario

      // 3. LOGICA DE RECORDAR (Esta NO se debe borrar al cerrar sesión)
      if (this.recordar) {
        localStorage.setItem('email_recordado', this.username);
      } else {
        localStorage.removeItem('email_recordado');
        // localStorage.removeItem('usuario_password'); // <-- Limpiar contraseña si no se desea recordar
      }

      console.log('Login correcto, navegando...');
      this.router.navigate(['/habitaciones']);
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  }

  // Navegación a la pestaña de Registro
  irARegistro() {
    this.router.navigate(['/registro']);
  }
}
