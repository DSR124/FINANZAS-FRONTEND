import { Documento } from './documento';
import { Banco } from './banco';

export class Contrato {
  id: number = 0;
  currency: string = '';
  valorNominal: number = 0;
  tasaDescontada: number = 0;
  valorRecibido: number = 0;
  dias: number = 0;
  tep: number = 0;
  tipoTasa: string = '';
  valorTasa: number = 0;
  estado: string = '';
  
  // Relación con Documento y Banco
  documento: Documento = new Documento();
  banco: Banco = new Banco();
}
