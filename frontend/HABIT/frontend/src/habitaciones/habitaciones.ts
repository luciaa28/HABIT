import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// Importa tus otros componentes si es necesario
import { Contacto } from '../contacto/contacto';
import { Residencias } from '../residencias/residencias';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, Residencias, Contacto, RouterLink],
  templateUrl: './habitaciones.html',
  styleUrl: './habitaciones.css',
})
export class Habitaciones implements OnInit {
  private router = inject(Router);
  private location = inject(PlatformLocation);
  private http = inject(HttpClient);

  /// VARIABLES CRÍTICAS PARA EL USUARIO
  usuarioLogueado: any = null;
  menuAbierto: boolean = false;
  nombreUsuario: string = 'USUARIO';

  // VARIABLES DE NAVEGACIÓN
  seccionActual: 'inicio' | 'residencias' = 'inicio';

  // Nueva variable para controlar qué vemos en la pantalla
  // 'inicio' mostrará el título gigante e info de empresa
  // 'residencias' mostrará la lista de habitaciones del JSON

  ngOnInit() {
    this.cargarUsuario();
    // Bloqueo del botón atrás para evitar salir de la sesión accidentalmente
    window.history.pushState(null, '', window.location.href);
    this.location.onPopState(() => {
      window.history.pushState(null, '', window.location.href);
    });
  }

  // --- LÓGICA DE NAVEGACIÓN INTERNA ---

  // Cambia la vista principal
  cambiarSeccion(seccion: 'inicio' | 'residencias') {
    this.seccionActual = seccion;
    // Si cambiamos de sección, subimos arriba del todo automáticamente
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Hace scroll suave hasta un ID específico (ej: la info de la empresa)
  // Esto es un "puente" para que el nombre viejo siga funcionando
  scrollToEmpresa() {
    this.scrollToSection('info-empresa');
  }
  scrollToSection(sectionId: string) {
    // Si estamos en la pestaña de residencias, primero volvemos a inicio
    if (this.seccionActual !== 'inicio') {
      this.seccionActual = 'inicio';
    }

    // Esperamos un momento a que Angular renderice la sección de inicio antes de bajar
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // --- LÓGICA DE USUARIO Y SESIÓN ---

  cargarUsuario() {
    const identificador = localStorage.getItem('usuario_email');

    if (!identificador) {
      console.warn('No hay ningún email en localStorage');
      return;
    }

    // Buscamos el usuario en nuestro archivo JSON
    this.http.get<any>('usuarios.json').subscribe({
      next: (response) => {
        const usuarioEncontrado = response.usuarios.find(
          (u: any) =>
            u.username.toLowerCase().trim() === identificador.toLowerCase().trim() ||
            u.email.toLowerCase().trim() === identificador.toLowerCase().trim(),
        );

        if (usuarioEncontrado) {
          this.usuarioLogueado = usuarioEncontrado;
          // Actualizamos el nombre para mostrar en el menú (sin el @dominio)
          this.nombreUsuario = this.usuarioLogueado.nombre.toUpperCase();
          console.log('Usuario cargado:', this.usuarioLogueado.nombre);
        }
      },
      error: (err) => console.error('Error al cargar usuarios.json', err),
    });
  }

  irAPerfil(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.menuAbierto = false;
    this.router.navigate(['/perfil']);
  }

  cerrarSesion() {
    localStorage.removeItem('sesion_activa');
    localStorage.removeItem('usuario_email');
    this.router.navigateByUrl('/login');
  }

  // --- LÓGICA DEL MENÚ ---

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuAbierto = !this.menuAbierto;
  }

  @HostListener('document:click')
  closeMenu() {
    this.menuAbierto = false;
  }
}
