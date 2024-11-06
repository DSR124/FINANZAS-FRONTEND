// cartera.ts
import { Empresa } from "./empresa";

export class Cartera {
    idCartera: number = 0;
    fechaDescuento:  Date = new Date();
    tcea: number = 0;
    fechaCreacion:  Date = new Date();
    empresa: Empresa = new Empresa();
    nombre: string = '';
    moneda: string = '';
}