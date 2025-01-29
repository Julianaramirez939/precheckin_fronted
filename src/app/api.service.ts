import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://192.168.1.17:8454/api'; // URL base de la API

  constructor(private http: HttpClient) { }

  /**
   * Consulta una reserva por ID.
   * @param id ID de la reserva.
   * @param token Token obtenido tras el login.
   * @param idusuariosesion ID de usuario de sesión.
   * @returns Observable con los datos de la reserva.
   */
  consultarReserva(id: number, token: string, idusuariosesion: string): Observable<any> {
    const url = `${this.baseUrl}/consultarReserva/${id}`;
    const headers = new HttpHeaders({
      'empresa': 'hcmonteria',
      'token': token,
      'idusuariosesion': idusuariosesion
    });

    return this.http.get(url, { headers });
  }
}
