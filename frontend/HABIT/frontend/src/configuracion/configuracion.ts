import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private renderer = inject(Renderer2);

  // Datos de usuario para la Navbar
  usuarioLogueado: any = null;
  menuAbierto: boolean = false;

  // Variables para controlar la selección de los botones (según tu imagen)
  temaSeleccionado: string = 'claro'; // Por defecto claro
  idiomaSeleccionado: string = 'español';

  ngOnInit() {
    this.cargarUsuario();
    const guardado = localStorage.getItem('tema-guardado');

    if (guardado) {
      this.temaSeleccionado = guardado;

      // Opcional: Reforzar la clase en el body por si acaso
      if (guardado === 'oscuro') {
        this.renderer.addClass(document.body, 'dark-mode');
      } else {
        this.renderer.removeClass(document.body, 'dark-mode');
      }
    }
  }

  cargarUsuario() {
    const identificador = localStorage.getItem('usuario_email');
    if (!identificador) return;

    this.http.get<any>('usuarios.json').subscribe({
      next: (response) => {
        const usuarioEncontrado = response.usuarios.find(
          (u: any) =>
            u.username?.toLowerCase() === identificador.toLowerCase() ||
            u.email?.toLowerCase() === identificador.toLowerCase(),
        );
        if (usuarioEncontrado) {
          this.usuarioLogueado = usuarioEncontrado;
        }
      },
      error: (err) => console.error('Error cargando usuario:', err),
    });
  }

  irAConfiguracion(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    console.log('1. Botón pulsado correctamente');

    const token = localStorage.getItem('sesion_activa');
    console.log('2. Estado de la sesión:', token);

    this.menuAbierto = false;

    // Forzamos la navegación
    this.router.navigateByUrl('/configuracion').then((success) => {
      if (success) {
        console.log('Navegación exitosa');
      } else {
        console.error('La navegación falló. Revisa tus rutas en app.routes.ts');
      }
    });
  }

  // Funciones para los selectores de tu diseño
  seleccionarTema(tema: string) {
    this.temaSeleccionado = tema;
    if (tema === 'oscuro') {
      this.renderer.addClass(document.body, 'dark-mode');
      localStorage.setItem('tema-guardado', 'oscuro'); // Guardamos "oscuro"
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
      localStorage.setItem('tema-guardado', 'claro'); // Guardamos "claro"
    }

    console.log('Modo visual:', tema);
  }

  seleccionarIdioma(idioma: string) {
    this.idiomaSeleccionado = idioma;
    console.log('Idioma cambiado a:', idioma);
  }

  // Funciones de la Navbar
  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuAbierto = !this.menuAbierto;
  }

  irAPerfil(event: Event) {
    event.preventDefault();
    this.menuAbierto = false;
    this.router.navigate(['/perfil']);
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
