import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, RouterModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);

  usuarioLogueado: any = null;
  menuAbierto: boolean = false;
  mapUrl!: SafeResourceUrl;

  ngOnInit() {
    console.log('--- PERFIL CARGADO ---');
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    const identificador = localStorage.getItem('usuario_email');

    if (!identificador) {
      console.warn('No hay ningún email en localStorage');
      return;
    }

    this.http.get<any>('usuarios.json').subscribe({
      next: (response) => {
        const usuarioEncontrado = response.usuarios.find(
          (u: any) =>
            u.username.toLowerCase().trim() === identificador.toLowerCase().trim() ||
            u.email.toLowerCase().trim() === identificador.toLowerCase().trim(),
        );

        if (usuarioEncontrado) {
          this.usuarioLogueado = usuarioEncontrado;

          const ubicacion =
            this.usuarioLogueado.ubicacion || 'Vitoria-Gasteiz';

          this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  `https://maps.google.com/maps?q=${encodeURIComponent(ubicacion)}&output=embed`
);
        }
      },
      error: (err) => console.error(err),
    });
  }

  irAPerfil(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    console.log('1. Botón pulsado correctamente');

    const token = localStorage.getItem('sesion_activa');
    console.log('2. Estado de la sesión:', token);

    this.menuAbierto = false;

    this.router.navigate(['/perfil']).then((nav) => {
      console.log('3. Navegación:', nav);
    });
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.user-menu-container')) {
      this.menuAbierto = false;
    }
  }
}