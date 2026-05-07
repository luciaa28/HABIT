import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, RouterModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private http = inject(HttpClient);
  usuarioLogueado: any = null;
  menuAbierto: boolean = false;
  private router = inject(Router);

  ngOnInit() {
    console.log('--- PERFIL CARGADO ---');
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    // 1. Obtenemos el email de quien está usando la app ahora mismo
    const emailSesion = localStorage.getItem('usuario_email');

    // 2. Leemos el archivo de usuarios
    this.http.get<any>('/usuarios.json').subscribe({
      next: (response) => {
        const lista = response.usuarios;
        // Buscamos al usuario
        this.usuarioLogueado = lista.find(
          (u: any) => u.email === emailSesion || u.username === emailSesion,
        );
        console.log('Resultado búsqueda:', this.usuarioLogueado);
      },
      error: (err) => console.error('Error cargando usuarios:', err),
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

  // Escuchar clics fuera para cerrar el menú
  @HostListener('document:click')
  clickOut() {
    this.menuAbierto = false;
  }
}

