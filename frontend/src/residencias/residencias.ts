import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-residencias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './residencias.html',
  styleUrl: './residencias.css'
})
export class Residencias implements OnInit{
  // Inyectamos el servicio HTTP
  private http = inject(HttpClient);

  // La lista empieza vacía
  listaResidencias: any[] = [];

 ngOnInit() {
    this.http.get<any[]>('/residencias.json').subscribe({
      next: (data) => {
        this.listaResidencias = data;
        console.log('Datos en el componente:', this.listaResidencias);
      },
      error: (err) => console.error('Error al cargar JSON:', err)
    });
  }
  cargarResidencias() {
    // Leemos el archivo JSON desde la carpeta assets
    this.http.get<any[]>('/residencias.json').subscribe({
      next: (data) => {
        this.listaResidencias = data;
        console.log('Residencias cargadas:', data);
      },
      error: (err) => {
        console.error('Error al cargar el JSON:', err);
      }
    });
  }

  verDetalles(id: number) {
    console.log('Ver detalles de residencia:', id);
  }
}
