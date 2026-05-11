import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule, PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-residencias',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, RouterModule],
  templateUrl: './residencias.html',
  styleUrl: './residencias.css',
})
export class Residencias implements OnInit {
  private router = inject(Router);
  private location = inject(PlatformLocation);
  private http = inject(HttpClient);
  /// VARIABLES CRÍTICAS PARA EL USUARIO
  usuarioLogueado: any = null;
  menuAbierto: boolean = false;
  nombreUsuario: string = 'USUARIO';
  // VARIABLES DE NAVEGACIÓN
  seccionActual: 'inicio' | 'residencias' = 'inicio';
  // VARIABLES PARA LOS FILTROS
  filtroUbicacion: string = '';
  filtroPrecioMin: number | null = null;
  filtroPrecioMax: number | null = null;
  filtroPersonas: number | null = null;
  //VARIABLE PARA PAGINACION
  p: number = 1;

  listaResidencias: any[] = []; // Datos originales del JSON
  listaFiltrada: any[] = []; // Datos que se muestran

  ngOnInit() {
    this.cargarUsuario(); // ¡Importante para que salga tu nombre arriba!
    this.cargarResidencias();
    this.http.get<any[]>('/residencias.json').subscribe({
      next: (data) => {
        this.listaResidencias = data;
        this.listaFiltrada = data;
        console.log('Datos en el componente:', this.listaResidencias);
      },
      error: (err) => console.error('Error al cargar JSON:', err),
    });
  }

  aplicarFiltros() {
    this.listaFiltrada = this.listaResidencias.filter((res) => {
      const cumpleUbicacion = res.ubicacion
        .toLowerCase()
        .includes(this.filtroUbicacion.toLowerCase());
      const cumpleMin = this.filtroPrecioMin ? res.precio >= this.filtroPrecioMin : true;
      const cumpleMax = this.filtroPrecioMax ? res.precio <= this.filtroPrecioMax : true;
      const cumplePersonas = this.filtroPersonas
        ? res.companeros.includes(this.filtroPersonas.toString())
        : true;

      return cumpleUbicacion && cumpleMin && cumpleMax && cumplePersonas;
    });
  }

  cargarResidencias() {
    // Leemos el archivo JSON desde la carpeta assets
    this.http.get<any[]>('residencias.json').subscribe({
      next: (data) => {
        this.listaResidencias = data;
        console.log('Residencias cargadas:', data);
      },
      error: (err) => {
        console.error('Error al cargar el JSON:', err);
      },
    });
  }

  verDetalles(id: number) {
    console.log('Ver detalles de residencia:', id);
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
          console.log('✅ Usuario cargado:', this.usuarioLogueado.nombre);
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
