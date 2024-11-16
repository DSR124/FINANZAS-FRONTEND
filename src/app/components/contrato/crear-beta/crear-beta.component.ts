import { Component, OnInit } from '@angular/core';
import { Banco } from '../../../models/banco';
import { Cartera } from '../../../models/cartera';
import { Documento } from '../../../models/documento';
import { BancoService } from '../../../services/banco.service';
import { CarteraService } from '../../../services/cartera.service';
import { DocumentoService } from '../../../services/documento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContratoService } from '../../../services/contrato.service';
import { Contrato } from '../../../models/contrato';
import jsPDF from 'jspdf';
import { LoginService } from '../../../services/login.service';
// Aquí agregamos el logo de la empresa en formato base64 (reemplaza este string con tu imagen base64)


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
  
  showRateSelection = false;
  showSections = false; // Variable para controlar la visibilidad de las secciones
  
  bancoData: Partial<Banco> | null = null;
  carteraData: Partial<Cartera> | null = null;
  documentoData: Partial<Documento> | null = null;

  tasaOpcion: string | null = null;
  periodoTasa: string | null = null;
  frecuenciaCapitalizacion: string | null = null;
  tasaResultado: number | null = null;

  fechaDescuento: Date | null = null;
  fechaVencimiento: Date | null = null;
  diasDiferencia: number | null = null;

  valorNominal: number | null = null;
  valorNeto: number | null = null;
  showRegisterButton = false; // Variable para controlar la visibilidad del botón "Registrar Contrato"

  constructor(
    private bancoService: BancoService,
    private carteraService: CarteraService,
    private documentoService: DocumentoService,
    private contratoService: ContratoService,
    private loginService: LoginService,
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
      balance: banco.balance
    };
    this.loadCarteras();
  }
// Cargar carteras por username
// Cargar carteras por username
loadCarteras(): void {
  const username = this.loginService.getUsername(); // Obtener el username desde el token
  if (!username) {
    console.error('No se pudo obtener el nombre de usuario del token.');
    return;
  }

  this.carteraService.getCarteraSummaryByUsername(username).subscribe(
    (data) => {
      // Mapear datos de CarteraResumenUsuario[] a Cartera[]
      this.carteras = data.map((item) => ({
        idCartera: item.idCartera,
        nombre: item.nombreCartera, // Ajustar según la propiedad correcta en CarteraResumenUsuario
        fechaDescuento: item.fechaDescuento || null, // Asignar valor predeterminado si no existe
        moneda: item.moneda || '', // Ajustar según las propiedades requeridas en Cartera
      } as Cartera));

      this.documentos = []; // Resetear documentos
    },
    (error) => {
      console.error('Error al cargar carteras:', error);
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
  if (this.isFormComplete()) {
    console.log('Contrato generado con éxito');
    // Activar las secciones solo si todos los campos están seleccionados
    this.showRateSelection = true;
    this.showSections = true; // Hacer visibles las secciones
  } else {
    console.warn('Seleccione un banco, una cartera y un documento antes de generar el contrato');
  }
}

  // Método para manejar la selección de tasa
  onSelectTasaOpcion(opcion: string): void {
    this.tasaOpcion = opcion; // Solo acepta "nominal" o "efectiva"
  }

  // Método para calcular la tasa seleccionada directamente desde los datos del banco
  calcularTasa(): void {
    if (this.selectedBanco) {
      if (this.tasaOpcion === 'nominal') {
        this.tasaResultado = this.selectedBanco.tasaNomninal; // Usar tasa nominal del banco
      } else if (this.tasaOpcion === 'efectiva') {
        this.tasaResultado = this.selectedBanco.tasaEfectiva; // Usar tasa efectiva del banco
      }
    } else {
      console.error('Por favor seleccione un banco antes de calcular la tasa.');
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
    // Mostrar el botón "Registrar Contrato" después de calcular el valor neto
    this.showRegisterButton = true;

    if (this.tasaOpcion === 'efectiva' && this.periodoTasa) {
      const tasa_efectiva_periodo = parseInt(this.periodoTasa, 10);
      this.valorNeto = this.calcularDescuentoEfectivo(monto, tasa_efectiva_periodo, dias, porcentaje_tasa);
    } else if (this.tasaOpcion === 'nominal' && this.periodoTasa && this.frecuenciaCapitalizacion) {
      const tasa_periodo_nominal = parseInt(this.periodoTasa, 10);
      const tasa_capitalizacion_nominal = parseInt(this.frecuenciaCapitalizacion, 10);
      this.valorNeto = this.calcularDescuentoNominal(monto, tasa_capitalizacion_nominal, tasa_periodo_nominal, dias, porcentaje_tasa);
    }
  }
  


 // Método para confirmar cambios al seleccionar banco, cartera o documento
 confirmChange(tipo: string): void {
  const confirmChange = confirm("¿Estás seguro de cambiar los datos?");
  if (confirmChange) {
    this.clearCalculations();
    this.disableSections();
    switch (tipo) {
      case 'banco':
        this.selectedBanco = null;
        this.bancoData = null;
        break;
      case 'cartera':
        this.selectedCartera = null;
        this.carteraData = null;
        break;
      case 'documento':
        this.selectedDocumento = null;
        this.documentoData = null;
        break;
    }
  }
}

// Método para borrar cálculos
clearCalculations(): void {
  this.tasaResultado = null;
  this.diasDiferencia = null;
  this.valorNominal = null;
  this.valorNeto = null;
}

// Método para deshabilitar las secciones
disableSections(): void {
  this.showRateSelection = false;
  this.showSections = false;
}

// Método para registrar el contrato
registrarContrato(): void {
  if (
    this.selectedDocumento &&
    this.selectedBanco &&
    this.valorNominal !== null &&
    this.valorNeto !== null &&
    this.diasDiferencia !== null &&
    this.tasaResultado !== null
  ) {
    const contrato = new Contrato();
    contrato.currency = this.selectedDocumento.currency || ''; // Moneda del documento
    contrato.valorNominal = this.valorNominal;
    contrato.tasaDescontada = 0; // Por ahora, tasa descontada es 0
    contrato.valorRecibido = this.valorNeto;
    contrato.dias = this.diasDiferencia;
    contrato.tep = 0; // Por ahora, tep es 0
    contrato.tipoTasa = this.tasaOpcion === 'efectiva' ? 'Efectiva' : 'Nominal';
    contrato.valorTasa = this.tasaResultado;
    contrato.estado = 'ACTIVO';
    contrato.documento = this.selectedDocumento;
    contrato.banco = this.selectedBanco;

    this.contratoService.insert(contrato).subscribe(
      (response) => {
        console.log('Contrato registrado exitosamente');

        // Cambiar el estado del documento a "DESCONTADO"
        if (this.selectedDocumento) {
          const documentoActualizado = { ...this.selectedDocumento, estado: 'DESCONTADO' }; // Crear una copia con el estado actualizado
          this.documentoService.modifyStatus(documentoActualizado).subscribe(
            () => {
              console.log('Estado del documento actualizado a "DESCONTADO".');
              this.generarPDF(contrato); // Generar el PDF después de actualizar el estado
            },
            (error) => {
              console.error('Error al actualizar el estado del documento:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error al registrar el contrato:', error);
      }
    );
  }
}



generarPDF(contrato: Contrato): void {
  const doc = new jsPDF();

  // Encabezado con Logo y Nombre de la Empresa
  doc.setFontSize(22);
  doc.setTextColor(0, 102, 204); // Color azul para el nombre de la empresa
  doc.text('FundWave', 55, 25); // Nombre de la empresa
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text('Contrato Registrado', 55, 32); // Subtítulo

  // Línea debajo del encabezado
  doc.setDrawColor(0, 102, 204);
  doc.line(20, 40, doc.internal.pageSize.getWidth() - 20, 40);

  // Información General del Contrato
  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text('Información del Contrato', 20, 50);
  doc.setDrawColor(150); // Línea gris debajo del subtítulo
  doc.line(20, 52, 80, 52);

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Moneda: ${contrato.currency}`, 20, 68);
  doc.text(`Valor Nominal: ${contrato.valorNominal}`, 20, 76);
  doc.text(`Tasa Descontada: ${contrato.tasaDescontada}`, 20, 84);
  doc.text(`Valor Recibido: ${contrato.valorRecibido}`, 20, 92);
  doc.text(`Días: ${contrato.dias}`, 20, 100);
  doc.text(`TEP: ${contrato.tep}`, 20, 108);
  doc.text(`Tipo de Tasa: ${contrato.tipoTasa}`, 20, 116);
  doc.text(`Valor de la Tasa: ${contrato.valorTasa}`, 20, 124);

  // Borde para la sección de Información General del Contrato
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 45, doc.internal.pageSize.getWidth() - 30, 95, 3, 3);

  // Detalles del Documento
  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text('Detalles del Documento', 20, 155);
  doc.setDrawColor(150);
  doc.line(20, 157, 80, 157);

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Tipo de Documento: ${contrato.documento.tipoDocumento}`, 20, 165);
  doc.text(`Valor del Documento: ${contrato.documento.valorDocumento}`, 20, 173);
  doc.text(`Fecha de Emisión: ${contrato.documento.fechaEmision}`, 20, 181);
  doc.text(`Fecha de Vencimiento: ${contrato.documento.fechaVencimiento}`, 20, 189);

  // Borde para la sección de Detalles del Documento
  doc.roundedRect(15, 150, doc.internal.pageSize.getWidth() - 30, 50, 3, 3);

  // Detalles del Banco
  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text('Detalles del Banco', 20, 215);
  doc.setDrawColor(150);
  doc.line(20, 217, 80, 217);

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Nombre del Banco: ${contrato.banco.nombre}`, 20, 225);
  doc.text(`Tasa Nominal: ${contrato.banco.tasaNomninal}`, 20, 233);
  doc.text(`Tasa Efectiva: ${contrato.banco.tasaEfectiva}`, 20, 241);

  // Borde para la sección de Detalles del Banco
  doc.roundedRect(15, 210, doc.internal.pageSize.getWidth() - 30, 40, 3, 3);

  // Pie de página con Firma
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text('Firma Autorizada', doc.internal.pageSize.getWidth() / 2, 295, { align: 'center' });

  // Descargar el PDF
  doc.save('Contrato_Registrado_FundWave.pdf');
}
}
