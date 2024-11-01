import { Cartera } from './cartera';

export class Documento {
  idDocumento: number = 0;
  tipoDocumento: string = '';
  valorDocumento: number = 0;
  currency: string = '';
  fechaEmision: Date = new Date();
  fechaVencimiento: Date = new Date();
  estado: string = '';
  clienteNombre: string = '';
  cartera: Cartera = new Cartera();
  clientePhone: string = '';
}