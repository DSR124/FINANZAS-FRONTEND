// cartera.ts
import { Empresa } from "./empresa";

export class Cartera {
    idCartera: number = 0;
    fechaDescuento: string = '';
    tcea: number = 0;
    fechaCreacion: string = '';
    empresa: Empresa = new Empresa();
    nombre: string = '';
    moneda: string = '';
}