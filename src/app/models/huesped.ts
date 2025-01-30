export interface Huesped {
  id: number;  // Renombrado de idHuesped a id
  tipoDocumento: string;
  documento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  direccion: string;
  pais: string;
  ciudad: string | string[];  // Permitir tanto un solo string como un array de strings
  telefono: string;
  email: string;
  paisOrigen: string;
  ciudadOrigen: string | string[];  // Permitir tanto un solo string como un array de strings
  paisDestino: string;
  ciudadDestino: string | string[];  // Permitir tanto un solo string como un array de strings
  huespedPrincipal: boolean;
  ////////////////
  id_reserva: number,
  id_reserva_habitacion: number,
  nombre_tipo_habitacion: string,
  id_check_in: number, 
  id_check_in_habitacion: number,
  id_habitacion: number, 
  id_cliente: number, // ID del cliente
  fecha_ingreso: string, // Fecha de ingreso de la reserva
  fecha_salida: string, // Fecha de salida de la reserva
  id_pais_origen: number, // ID del país de origen
  id_ciudad_origen: number, // ID de la ciudad de origen 
  id_pais_destino: number, // ID del país destino
  id_ciudad_destino: number, // ID de la ciudad destino
  id_relacion_huesped: number,
  id_externo: string, 
  id_siat: number, 
  estado: string, 
  tempId: number
}


