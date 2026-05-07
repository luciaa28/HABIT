import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterEvent, RouterLink } from '@angular/router';
import { Contacto } from '../contacto/contacto';
import { Residencias } from '../residencias/residencias';
import { PlatformLocation } from '@angular/common';

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

  nombreUsuario: string = 'USUARIO';
  menuAbierto: boolean = false;

  ngOnInit() {
    // Recuperar nombre
    const guardado = localStorage.getItem('usuario_email');
    this.nombreUsuario = guardado ? guardado.split('@')[0].toUpperCase() : 'USUARIO';

    // BLOQUEO BOTÓN ATRÁS: Creamos un estado artificial en el historial
    window.history.pushState(null, '', window.location.href);
    this.location.onPopState(() => {
      // Si el usuario intenta ir atrás, volvemos a meter el estado para que se quede aquí
      window.history.pushState(null, '', window.location.href);
    });
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuAbierto = !this.menuAbierto;
  }

  @HostListener('document:click')
  closeMenu() {
    this.menuAbierto = false;
  }

  cerrarSesion() {
    // Borramos los datos de la sesión actual
    localStorage.removeItem('sesion_activa');
    localStorage.removeItem('usuario_email');

    // IMPORTANTE: NO borramos 'email_recordado'

    this.router.navigateByUrl('/login');
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  irAPerfil(event: Event) {
event.preventDefault();
  event.stopPropagation(); // Evita que el clic se pierda en el menú
  
  console.log("1. Botón pulsado correctamente");
  
  const token = localStorage.getItem('sesion_activa');
  console.log("2. Estado de la sesión en localStorage:", token);

  this.menuAbierto = false;
  
  console.log("3. Intentando navegar a /perfil...");
  this.router.navigate(['/perfil']).then(nav => {
    console.log("4. ¿La navegación tuvo éxito?:", nav);
  }).catch(err => {
    console.error("4. ERROR CRÍTICO EN NAVEGACIÓN:", err);
  });
}
}
