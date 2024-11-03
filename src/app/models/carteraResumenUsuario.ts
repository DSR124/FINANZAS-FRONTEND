// cartera-resumen-usuario.ts
import { Empresa } from "./empresa";

export class CarteraResumenUsuario {
  idCartera: number | null = null;
  nombreCartera: string = '';
  fechaCreacion: Date | null = null;
  fechaDescuento: Date | null = null;
  nombreEmpresa: string = '';
  tcea: number | null = null;
  moneda: string = '';
  cantidadDocumentos: number | null = null;
  montoTotalCartera: number | null = null;

  constructor(data?: Partial<CarteraResumenUsuario>) {
    if (data) {
      this.idCartera = data.idCartera ?? null;
      this.nombreCartera = data.nombreCartera ?? '';
      this.fechaCreacion = data.fechaCreacion ? new Date(data.fechaCreacion) : null;
      this.fechaDescuento = data.fechaDescuento ? new Date(data.fechaDescuento) : null;
      this.nombreEmpresa = data.nombreEmpresa ?? '';
      this.tcea = data.tcea ?? null;
      this.moneda = data.moneda ?? '';
      this.cantidadDocumentos = data.cantidadDocumentos ?? null;
      this.montoTotalCartera = data.montoTotalCartera ?? null;
    }
  }
}
