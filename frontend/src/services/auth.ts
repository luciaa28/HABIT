import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyectamos HttpClient correctamente
  private http = inject(HttpClient);

  /**
   * Método para iniciar sesión leyendo el JSON local
   */
  async login(username: string, password: string): Promise<boolean> {
    try {
      // 1. Leemos el archivo JSON de la carpeta public
      // Ponemos <any> porque ahora el JSON es un objeto, no un array directo
      const data: any = await firstValueFrom(this.http.get('/usuarios.json'));

      // 2. Accedemos a la lista de usuarios dentro del objeto
      const listaUsuarios = data.usuarios;

      // 3. Buscamos si existe el usuario con ese username (o email) y contraseña
      const usuarioEncontrado = listaUsuarios.find((u: any) => 
        (u.username === username || u.email === username) && u.password === password
      );

      // Si existe, devolvemos true
      return !!usuarioEncontrado;

    } catch (error) {
      console.error('Error en el login:', error);
      return false;
    }
  }

  /**
   * NOTA SOBRE REGISTER: 
   * Como estás usando un archivo .json local en la carpeta public, 
   * NO puedes hacer un "POST" (guardar datos) mediante código de navegador.
   * El navegador no tiene permiso para escribir archivos en tu disco duro.
   */
  async register(nuevoUsuario: any): Promise<boolean> {
    console.warn('El registro no funcionará en un archivo JSON local (solo lectura).');
    return false;
  }
}