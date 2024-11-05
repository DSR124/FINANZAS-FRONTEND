import { Component, OnInit } from '@angular/core';
import { Banco } from '../../../models/banco';
import { Cartera } from '../../../models/cartera';
import { Documento } from '../../../models/documento';
import { BancoService } from '../../../services/banco.service';
import { CarteraService } from '../../../services/cartera.service';
import { DocumentoService } from '../../../services/documento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-beta',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './crear-beta.component.html',
  styleUrl: './crear-beta.component.css'
})
export class CrearBetaComponent  implements OnInit{
  bancos: Banco[] = [];
  carteras: Cartera[] = [];
  documentos: Documento[] = [];

  selectedBanco: Banco | null = null;
  selectedCartera: Cartera | null = null;
  selectedDocumento: Documento | null = null;

  bancoData: Partial<Banco> | null = null;
  carteraData: Partial<Cartera> | null = null;
  documentoData: Partial<Documento> | null = null;

  showRateSelection = false;
  tasaOpcion: string | null = null;
  periodoTasa: string | null = null;
  frecuenciaCapitalizacion: string | null = null;
  tasaResultado: number | null = null;

  fechaDescuento: Date | null = null;
  fechaVencimiento: Date | null = null;
  diasDiferencia: number | null = null;

  valorNominal: number | null = null;
  valorNeto: number | null = null;

  constructor(
    private bancoService: BancoService,
    private carteraService: CarteraService,
    private documentoService: DocumentoService
  ) {}

  ngOnInit(): void {
    this.loadBancos();
  }

  loadBancos(): void {
    this.bancoService.list().subscribe(
      (data) => {
        this.bancos = data;
      },
      (error) => {
        console.error('Error loading bancos:', error);
      }
    );
  }

  onSelectBanco(banco: Banco): void {
    this.selectedBanco = banco;
    this.bancoData = {
      nombre: banco.nombre,
      tasaNomninal: banco.tasaNomninal,
      tasaEfectiva: banco.tasaEfectiva,
      cosionExtra: banco.cosionExtra
    };
    this.loadCarteras();
  }

  loadCarteras(): void {
    this.carteraService.list().subscribe(
      (data) => {
        this.carteras = data;
        this.selectedCartera = null;
        this.documentos = [];
      },
      (error) => {
        console.error('Error loading carteras:', error);
      }
    );
  }

  onSelectCartera(cartera: Cartera): void {
    this.selectedCartera = cartera;
    this.carteraData = {
      nombre: cartera.nombre,
      fechaDescuento: cartera.fechaDescuento,
      empresa: cartera.empresa,
      moneda: cartera.moneda
    };

    // Guardar la fecha de descuento
    this.fechaDescuento = new Date(cartera.fechaDescuento);

    // Restablecer los datos del documento al cambiar de cartera
    this.documentoData = null;
    this.selectedDocumento = null;

    this.loadDocumentos(cartera.idCartera);
  }

  loadDocumentos(idCartera: number): void {
    this.documentoService.listByCarteraId(idCartera).subscribe(
      (data) => {
        this.documentos = data.map((item) => {
          return {
            idDocumento: item.idDocumento,
            tipoDocumento: item.tipoDocumento,
            valorDocumento: item.valorDocumento,
            currency: item.documentoCurrency,
            fechaEmision: item.fechaEmision,
            fechaVencimiento: item.fechaVencimiento,
          } as Documento;
        });
        this.selectedDocumento = null;
      },
      (error) => {
        console.error('Error loading documentos:', error);
      }
    );
  }


  onSelectDocumento(documento: Documento): void {
    this.selectedDocumento = documento;
    this.documentoData = {
      tipoDocumento: documento.tipoDocumento,
      valorDocumento: documento.valorDocumento,
      currency: documento.currency,
      fechaEmision: documento.fechaEmision,
      fechaVencimiento: documento.fechaVencimiento
    };

    // Guardar la fecha de vencimiento
    this.fechaVencimiento = new Date(documento.fechaVencimiento);
  }



  // Verificar si todos los campos están seleccionados
  isFormComplete(): boolean {
    return this.selectedBanco !== null && this.selectedCartera !== null && this.selectedDocumento !== null;
  }

  // Método para generar el contrato
  generarContrato(): void {
    console.log('Contrato generado con éxito');
    // Mostrar la sección de selección de tasa
    this.showRateSelection = true;
  }

  // Método para manejar la selección de tasa
  onSelectTasaOpcion(opcion: string): void {
    this.tasaOpcion = opcion;
    this.periodoTasa = null; // Resetear el periodo de tasa al cambiar de opción
    this.frecuenciaCapitalizacion = null; // Resetear la frecuencia de capitalización
  }
   // Método para calcular la tasa seleccionada
   calcularTasa(): void {
    if (this.selectedBanco) {
      this.tasaResultado = this.tasaOpcion === 'nominal' ? this.selectedBanco.tasaNomninal : this.selectedBanco.tasaEfectiva;
    }
  }

  calcularDias(): void {
    if (this.fechaDescuento && this.fechaVencimiento) {
      const diferenciaMs = this.fechaVencimiento.getTime() - this.fechaDescuento.getTime();
      this.diasDiferencia = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    }
  }

  calcularValorNominal(): void {
    if (this.selectedDocumento) {
      this.valorNominal = this.selectedDocumento.valorDocumento;
    }
  }

  // Función para convertir la tasa de porcentaje a decimal
  convertirPorcentajeADecimal(tasa: number): number {
    return tasa / 100;
  }
  
  // Función para calcular el descuento con tasa efectiva
  calcularDescuentoEfectivo(valorNominal: number, tasaEfectivaPeriodo: number, dias: number, porcentajeTasa: number): number {
    let divisor_periodo = 1;

    // Determinar el divisor de periodo basado en la opción seleccionada
    switch (tasaEfectivaPeriodo) {
        case 1:
            divisor_periodo = 1; // Tasa diaria
            break;
        case 2:
            divisor_periodo = 30; // Tasa mensual
            break;
        case 3:
            divisor_periodo = 360; // Tasa anual
            break;
    }

    // Convertir porcentaje a decimal
    const tasa_decimal = this.convertirPorcentajeADecimal(porcentajeTasa);

    // Calcular la tasa de descuento diaria
    const tasa_descuento_diaria = Math.pow(1 + tasa_decimal, 1 / divisor_periodo) - 1;

    // Asegurarse de que la tasa de descuento diaria está correcta en consola para depuración
    console.log("Tasa Descuento Diaria:", tasa_descuento_diaria);

    // Calcular el valor neto usando la fórmula C = S / (1 + i)^n
    const valor_neto = valorNominal / Math.pow(1 + tasa_descuento_diaria, dias);

    // Mostrar valor neto en consola para depuración
    console.log("Valor Neto Calculado (Efectiva):", valor_neto);

    return valor_neto;
  }
  // Función para calcular el descuento con tasa nominal
  calcularDescuentoNominal(valorNominal: number, tasaCapitalizacionNominal: number, tasaPeriodoNominal: number, dias: number, porcentajeTasa: number): number {
    let divisor_periodo = 1;
    let factor_capitalizacion = 1;

    // Determinar el divisor de periodos
    switch (tasaPeriodoNominal) {
      case 1:
        divisor_periodo = 1; // Tasa diaria
        break;
      case 2:
        divisor_periodo = 12; // Tasa mensual
        break;
      case 3:
        divisor_periodo = 360; // Tasa anual
        break;
    }

    // Determinar el factor de capitalización
    switch (tasaCapitalizacionNominal) {
      case 1:
        factor_capitalizacion = divisor_periodo; // Capitalización diaria
        break;
      case 2:
        factor_capitalizacion = 12; // Capitalización mensual
        break;
      case 3:
        factor_capitalizacion = 1; // Capitalización anual
        break;
    }

    // Convertir porcentaje a decimal
    const tasa_decimal = this.convertirPorcentajeADecimal(porcentajeTasa);

    // Calcular la tasa efectiva anual usando el factor de capitalización
    const tasa_efectiva_anual = Math.pow(1 + tasa_decimal / factor_capitalizacion, factor_capitalizacion) - 1;

    // Convertir la tasa efectiva anual a la tasa efectiva para los días correspondientes
    const tasa_efectiva_dias = Math.pow(1 + tasa_efectiva_anual, dias / 360) - 1;
    const descuento = tasa_efectiva_dias / (1 + tasa_efectiva_dias);

    // Calcular el valor neto
    const valor_neto = valorNominal * (1 - descuento);
    return valor_neto;
  }

  // Método para calcular el valor neto basado en la tasa seleccionada
  calcularValorNeto(): void {
    const monto = this.valorNominal || 0;
    const porcentaje_tasa = this.tasaResultado ? this.convertirPorcentajeADecimal(this.tasaResultado) : 0;
    const dias = this.diasDiferencia || 0;

    if (this.tasaOpcion === 'efectiva' && this.periodoTasa) {
      const tasa_efectiva_periodo = parseInt(this.periodoTasa, 10);
      this.valorNeto = this.calcularDescuentoEfectivo(monto, tasa_efectiva_periodo, dias, porcentaje_tasa);
    } else if (this.tasaOpcion === 'nominal' && this.periodoTasa && this.frecuenciaCapitalizacion) {
      const tasa_periodo_nominal = parseInt(this.periodoTasa, 10);
      const tasa_capitalizacion_nominal = parseInt(this.frecuenciaCapitalizacion, 10);
      this.valorNeto = this.calcularDescuentoNominal(monto, tasa_capitalizacion_nominal, tasa_periodo_nominal, dias, porcentaje_tasa);
    }
  }

}
