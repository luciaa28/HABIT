import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login';
import { Habitaciones} from '../habitaciones/habitaciones';
import { RegistroComponent } from '../registro/registro';
import { authGuard } from '../services/auth-guard';
import { Perfil } from '../perfil/perfil';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'habitaciones', 
    component: Habitaciones, 
    canActivate: [authGuard]
   }, // <--- ESTO ES LO QUE BLOQUEA EL ACCESO//RUTA POR DEFECTO (VACIA)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
    //EL COMODIN (ERRORES) SIEMPRE DEBE SER EL ULTIMO DE LA LISTA
  //{ path: '**', redirectTo: 'login' },

  { path: 'perfil', component: Perfil}
];