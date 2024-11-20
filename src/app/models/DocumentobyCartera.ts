export class DocumentoByCartera {
  idCartera: number | null = null; // Se permite `null` si el valor puede ser opcional
  nombreCartera: string = ''; 
  fechaDescuento: Date | null = null; // Se permite `null` si no siempre hay fecha
  moneda: string = '';
  idDocumento: number | null = null; // Manejar `null` en caso de datos faltantes
  fechaEmision: Date | null = null; // Manejar fechas opcionales
  fechaVencimiento: Date | null = null;
  valorDocumento: number | null = null; // Manejar `null` si el valor puede estar ausente
  clienteNombre: string = '';
  clientePhone: string = '';
  documentoCurrency: string = '';
  estado: string = '';
  tipoDocumento: string = '';
  tep: number | null = null; // Agregado el campo TEP como opcional
}
