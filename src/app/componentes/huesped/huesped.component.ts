import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Inyectamos Router y ActivatedRoute
import { ApiService } from '../../api.service';
import { ApiRestService } from '../../api-rest.service';
import { Huesped } from '../../models/huesped';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-huesped',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './huesped.component.html',
  styleUrls: ['./huesped.component.css'],
})
export class HuespedComponent implements OnInit {
  reserva: any;
  habitacion: any;
  tiposDocumentos = [
    { value: 'DNI', label: 'DNI' },
    { value: 'Pasaporte', label: 'Pasaporte' },
    { value: 'Licencia', label: 'Licencia' },
    { value: 'Cédula', label: 'Cédula' },
  ];
  indexHuespedCambio: any = null;
  campoEditar: string = '';
  campoOriginal: any;
  campoNombre: string = '';
  idPreCheckin: number = 0;
  Precheckins: any[] = [];
  primerHuesped: any;

  ciudadesColombia: string[] = [
    'Bogotá',
    'Medellín',
    'Cali',
    'Barranquilla',
    'Cartagena',
  ];

  constructor(
    private apiService: ApiService,
    private apiRestService: ApiRestService,
    private activatedRoute: ActivatedRoute // Inyectamos ActivatedRoute para acceder a los parámetros de la URL
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la reserva desde la URL
    const idReservaFromUrl =
      this.activatedRoute.snapshot.paramMap.get('id_reserva');

    if (idReservaFromUrl) {
      // Si existe un ID en la URL, lo convertimos a número y llamamos a obtenerReserva
      this.idPreCheckin = Number(idReservaFromUrl);
      this.obtenerReserva(Number(idReservaFromUrl));
    }
  }

  // Método para obtener la reserva por ID
  obtenerReserva(id_reserva: number): void {
    this.apiRestService.obtenerReserva(id_reserva).subscribe({
      next: (data: any) => {
        console.log('data de obtener reserva(precheckins)', data);
        this.Precheckins = data;

        // Si no hay ID en la URL, seguimos con el flujo normal
        const token = '9114208100015241';
        const idusuariosesion = 'COMANDO';

        this.apiService
          .consultarReserva(id_reserva, token, idusuariosesion)
          .subscribe({
            next: (data: any) => {
              this.reserva = data.reserva;
              this.procesarReserva();
            },
            error: (err) => {
              console.error('Error al obtener la reserva:', err);
            },
          });
      },
      error: (err) => {
        console.error('Error al obtener la reserva:', err);
      },
    });
  }

  procesarReserva(): void {
    if (this.reserva?.habitaciones?.length > 0) {
      let tempId = 0;
      this.reserva.habitaciones.forEach((habitacion: any) => {
        const cantidadHuespedes =
          habitacion.cantidad_adulto + habitacion.cantidad_infante;
        habitacion.huespedes = habitacion.huespedes || [];

        if (this.Precheckins.length > 0) {
          console.log('Ya hay prechekins creados');
          habitacion.huespedes = this.Precheckins.filter(
            (precheckin) => precheckin.id_reserva_habitacion == habitacion.id
          );
        } else {
          console.log('Se van a crear precheckins vacios');

          for (let i = 0; i < cantidadHuespedes; i++) {
            console.log('tempId en creacion de precheckin vacio', tempId);
            const huespedObj: Huesped = {
              tipoDocumento: '',
              documento: '',
              primerNombre: '',
              segundoNombre: '',
              primerApellido: '',
              segundoApellido: '',
              direccion: '',
              pais: '',
              ciudad: '',
              telefono: '',
              email: '',
              paisOrigen: '',
              ciudadOrigen: '',
              paisDestino: '',
              ciudadDestino: '',
              huespedPrincipal: false,
              id_reserva: this.reserva.id,
              id_reserva_habitacion: habitacion.id,
              nombre_tipo_habitacion:
                habitacion.habitacion.nombre_tipo_habitacion,
              id_check_in: 0,
              id_check_in_habitacion: 0,
              id_habitacion: habitacion.habitacion.id,
              id_cliente: this.reserva.cliente.id,
              fecha_ingreso: this.reserva.fecha_inicio,
              fecha_salida: this.reserva.fecha_fin,
              id_pais_origen: this.reserva.cliente.id_pais,
              id_ciudad_origen: 0,
              id_pais_destino: this.reserva.sede.ciudad.id_pais,
              id_ciudad_destino: 0,
              id_relacion_huesped: 0,
              id_externo: '',
              id_siat: 0,
              estado: 'reservado',
              id: 0,
              tempId: tempId,
            };
            habitacion.huespedes.push(huespedObj);
            tempId++;
          }
          this.guardarCambios();
        }
        this.primerHuesped = this.reserva?.habitaciones[0]?.huespedes[0];
      });
    } else {
      console.error('No se encontraron habitaciones en la reserva');
    }

    console.log('Reserva procesada:', this.reserva);
  }

  getRowSpan(huespedesLength: number): string {
    return `span ${huespedesLength}`;
  }

  sincronizarCampos(campo: string, valor: any): void {
    const camposASincronizar = [
      'direccion',
      'pais',
      'ciudad',
      'telefono',
      'email',
      'paisOrigen',
      'ciudadOrigen',
      'paisDestino',
      'ciudadDestino',
    ];

    if (camposASincronizar.find((word) => word == campo)) {
      this.reserva.habitaciones.forEach((habitacion: any) => {
        habitacion.huespedes.forEach((huesped: any, index: number) => {
          if (index !== 0) {
            huesped[campo] = this.primerHuesped[campo];
          }
        });
      });
    }
  }

  cambiarPais(index: number, campoPais: string, campoCiudad: string) {
    const huesped = this.reserva.habitaciones.flatMap(
      (habitacion: any) => habitacion.huespedes
    )[index];

    if (huesped) {
      huesped[campoPais] = huesped[campoPais];
      huesped[campoCiudad] = huesped[campoCiudad];
    }
  }

  cambiarPaisOrigen(
    index: number,
    campoPaisOrigen: string,
    campoCiudadOrigen: string
  ) {
    const huesped = this.reserva.habitaciones.flatMap(
      (habitacion: any) => habitacion.huespedes
    )[index];

    if (huesped) {
      huesped[campoPaisOrigen] = huesped[campoPaisOrigen];
      huesped[campoCiudadOrigen] = huesped[campoCiudadOrigen];
    }
  }

  cambiarPaisDestino(
    index: number,
    campoPaisDestino: string,
    campoCiudadDestino: string
  ) {
    const huesped = this.reserva.habitaciones.flatMap(
      (habitacion: any) => habitacion.huespedes
    )[index];

    if (huesped) {
      huesped[campoPaisDestino] = huesped[campoPaisDestino];
      huesped[campoCiudadDestino] = huesped[campoCiudadDestino];
    }
  }

  abrirModal(index: number, campo: string, valor: any) {
    this.campoNombre = campo; // Asigna el nombre del campo a editar
    this.campoOriginal = valor; // Guarda el valor original del campo
    this.campoEditar = valor; // Inicializa el valor editable
    this.indexHuespedCambio = index;
    const modalElement = document.getElementById('editModal'); // Obtiene el elemento del modal
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement); // Crea un modal usando Bootstrap
      modal.show(); // Muestra el modal
    }
  }

  guardarCambios() {
    console.log('reserva antes de procesar huespedes', this.reserva);
    let huesped: any = null;
    let huespedesAux: any[] = [];

    huespedesAux = this.reserva.habitaciones.flatMap(
      (habitacion: any) => habitacion.huespedes
    );

    if (this.indexHuespedCambio !== null) {
      huesped = huespedesAux[this.indexHuespedCambio];
    } else {
      console.error('No se ha encontrado el índice de huésped.');
    }

    if (huesped) {
      huesped[this.campoNombre] = this.campoEditar;

      if (huesped === this.primerHuesped) {
        this.sincronizarCampos(this.campoNombre, this.campoEditar);
      }

      const modalElement = document.getElementById('editModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
      }
    }

    this.apiRestService.guardarReserva(huespedesAux).subscribe({
      next: (response) => {
        console.log('Response de guardarReserva', response);
        response.forEach((huespedActualizado: any) => {
          let index = -1;
          if (
            huespedActualizado.hasOwnProperty('tempId') &&
            huespedActualizado.tempId != null
          ) {
            index = huespedesAux.findIndex(
              (h) => h.tempId == huespedActualizado.tempId
            );
          } else {
            index = huespedesAux.findIndex(
              (h) => h.id == huespedActualizado.id
            );
          }

          if (index > -1) {
            huespedesAux[index].id = huespedActualizado.id;
          }
        });
        console.log('reserva luego de guardar', this.reserva);
      },
      error: (err) => {
        console.error('Error al guardar el huésped', err);
      },
    });
  }
  cambiarSelect(index: number, campo: string, valor: any) {
    this.campoNombre = campo;
    this.campoOriginal = valor;
    this.campoEditar = valor;
    this.indexHuespedCambio = index;

    this.guardarCambios();
  }
}
