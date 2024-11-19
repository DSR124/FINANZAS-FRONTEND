export class CarteraResumenUsuario {
  idCartera: number | null = null; // Identificador de la cartera, puede ser nulo si aún no se asigna
  nombreCartera: string = ''; // Nombre de la cartera
  fechaCreacion: Date = new Date(); // Fecha de creación de la cartera
  fechaDescuento: Date = new Date(); // Fecha de descuento, inicializada como nula
  nombreEmpresa: string = ''; // Nombre de la empresa asociada
  tcea: number = 0; // TCEA promedio de los documentos asociados
  moneda: string = ''; // Moneda de la cartera (e.g., PEN, USD)
  cantidadDocumentos: number = 0; // Cantidad total de documentos en la cartera
  montoTotalCartera: number = 0; // Monto total de los documentos asociados
}
