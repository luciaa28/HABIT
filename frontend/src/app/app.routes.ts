import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login';
import { Habitaciones} from '../habitaciones/habitaciones';
import { RegistroComponent } from '../registro/registro';
import { authGuard } from '../services/auth-guard';
import { Perfil } from '../perfil/perfil';
import { Residencias } from '../residencias/residencias';
import { Configuracion } from '../configuracion/configuracion';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'habitaciones', component: Habitaciones, canActivate: [authGuard] },
  { path: 'residencias', component: Residencias }, 
  { path: 'perfil', component: Perfil},
  { path: 'configuracion', component: Configuracion}

];