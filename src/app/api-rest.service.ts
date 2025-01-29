import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiRestService {
  private apiUrl = 'http://localhost:3000/precheckin'; // URL base para las solicitudes

  constructor(private http: HttpClient) {}


  guardarReserva(huespedes: any[]): Observable<any[]> {
    console.log("Datos enviados desde el frontend:", huespedes);
    
    const requests = huespedes.map(huesped => {
        if (huesped.id === 0) {
            return this.http.post<any>(this.apiUrl, huesped);
        } else {
            const url = `${this.apiUrl}/${huesped.id}`;
            return this.http.put<any>(url, huesped);
        }
    });
    
    return forkJoin(requests);
}

  obtenerReserva(id_reserva: number): Observable<any> {
    const url = `${this.apiUrl}/${id_reserva}`; 
    console.log("Datos obtenidos desde la api: ", id_reserva); 
    return this.http.get<any>(url); 
  }
}
