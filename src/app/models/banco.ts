export class Banco {
    idBanco: number = 0;
    nombre: string = '';           
    imageUrl: string = '';          
    balance: number = 0;            
    tasaNomninal: number = 0;       // Nota: se mantiene "tasaNomninal" con doble 'n' para que coincida con el JSON
    tasaEfectiva: number = 0;       
    cosionExtra: number = 0;        // Nota: se mantiene "cosionExtra" con 's'
    creationDate: Date = new Date();
  }
  