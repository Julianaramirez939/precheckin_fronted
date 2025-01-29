import { Routes } from '@angular/router';
import { HuespedComponent } from './componentes/huesped/huesped.component';

export const routes: Routes = [
  { path: 'reserva', component: HuespedComponent }, 
  { path: 'reserva/:id_reserva', component: HuespedComponent },
  { path: '', redirectTo: 'reserva', pathMatch: 'full' },
  { path: '**', redirectTo: 'reserva' },
];
