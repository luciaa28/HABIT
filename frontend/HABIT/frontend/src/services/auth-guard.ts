// Aquí es donde controlamos si el usuario tiene permiso para entrar a las rutas.

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Comprobamos si existe la sesión
  const sesion = localStorage.getItem('sesion_activa');
  const email = localStorage.getItem('usuario_email');
  
  // IMPORTANTE: Ahora vigilamos 'sesion_activa' para la seguridad  
  const isAuthenticated = localStorage.getItem('sesion_activa') === 'true'; 

  if (isAuthenticated) {
    // Si el usuario está logueado y trata de ir al LOGIN, lo mandamos a PRINCIPAL
    if (state.url === '/login') {
      router.navigate(['/habitaciones']);
      return false;
    }
    return true;
  } else {
    // Si NO está logueado y trata de entrar a otra parte, al LOGIN
    if (state.url !== '/login') {
      router.navigate(['/login']);
      return false;
    }
    return true;
  }
};