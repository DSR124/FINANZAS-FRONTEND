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
  showSections = false; // Controla la visibilidad de las secciones
  showTCEASection: boolean = false;
  showRegisterButton: boolean = false;

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
  TCEAResultado: number | null = null;

  constructor(
    private bancoService: BancoService,
    private carteraService: CarteraService,
    private documentoService: DocumentoService,
    private contratoService: ContratoService,
    private loginService: LoginService
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

  loadCarteras(): void {
    const username = this.loginService.getUsername();
    if (!username) {
      console.error('No se pudo obtener el nombre de usuario del token.');
      return;
    }

    this.carteraService.getCarteraSummaryByUsername(username).subscribe(
      (data) => {
        this.carteras = data.map((item) => ({
          idCartera: item.idCartera,
          nombre: item.nombreCartera,
          fechaDescuento: item.fechaDescuento || null,
          moneda: item.moneda || ''
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

    this.fechaDescuento = new Date(cartera.fechaDescuento);
    this.documentoData = null;
    this.selectedDocumento = null;

    this.loadDocumentos(cartera.idCartera);
  }

  loadDocumentos(idCartera: number): void {
    this.documentoService.listByCarteraId(idCartera).subscribe(
      (data) => {
        this.documentos = data.map((item) => ({
          idDocumento: item.idDocumento,
          tipoDocumento: item.tipoDocumento,
          valorDocumento: item.valorDocumento,
          estado: item.estado,
          currency: item.documentoCurrency,
          fechaEmision: item.fechaEmision,
          fechaVencimiento: item.fechaVencimiento
        } as Documento));
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
      estado: documento.estado,

      currency: documento.currency,
      fechaEmision: documento.fechaEmision,
      fechaVencimiento: documento.fechaVencimiento
    };

    this.fechaVencimiento = new Date(documento.fechaVencimiento);
  }

  isFormComplete(): boolean {
    return this.selectedBanco !== null && this.selectedCartera !== null && this.selectedDocumento !== null;
  }

  generarContrato(): void {
    if (this.selectedDocumento?.estado === 'DESCONTADO') {
      alert('El documento seleccionado ya está "DESCONTADO". No se puede generar un contrato.');
      return;
    }

    if (this.isFormComplete()) {
      this.showRateSelection = true;
      this.showSections = true;
    } else {
      alert('Complete todos los campos para generar el contrato.');
    }
  }
  calcularTasa(): void {
    if (this.selectedBanco && this.tasaOpcion) {
      if (this.tasaOpcion === 'nominal') {
        // Conversión de Tasa Nominal Anual a Tasa Efectiva Periodal (Diaria)
        const tasaNominal = this.selectedBanco.tasaNomninal/100; // Convertir porcentaje a decimal
        const m = 360; // Capitalización diaria
        // Calcular Tasa Efectiva Anual (TEA)
        this.tasaResultado = (Math.pow(1 + tasaNominal / m, m) - 1) * 100; // Convertir a porcentaje
        console.log('Tasa Nominal convertida a Tasa Efectiva (Diaria):', this.tasaResultado);
      } else if (this.tasaOpcion === 'efectiva') {
        // Directamente usa la tasa efectiva proporcionada por el banco
        this.tasaResultado = this.selectedBanco.tasaEfectiva;
        console.log('Tasa Efectiva Anual seleccionada:', this.tasaResultado);
      }
    } else {
      console.warn('Por favor seleccione un banco y una opción de tasa antes de calcular.');
    }
  }
  onSelectTasaOpcion(opcion: string): void {
    this.tasaOpcion = opcion;
  
    if (this.selectedBanco) {
      if (opcion === 'nominal') {



      } else if (opcion === 'efectiva') {
        this.tasaResultado = this.selectedBanco.tasaEfectiva; // Asigna la tasa efectiva del banco
        this.calcularDescuentoEfectivo(); // Calcula el descuento automáticamente
      }
    } else {
      console.warn('Por favor seleccione un banco antes de elegir una opción de tasa.');
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

  calcularDescuentoEfectivo(): void {
    if (
      this.valorNominal !== null &&
      this.tasaResultado !== null &&
      this.diasDiferencia !== null
    ) {
      const tasaDiaria = Math.pow(1 + this.tasaResultado / 100, 1 / 360) - 1;
      this.valorNeto = this.valorNominal / Math.pow(1 + tasaDiaria, this.diasDiferencia);
      const descuento = this.valorNominal - this.valorNeto;
  
      // Habilitar la sección de TCEA
      this.showTCEASection = true;
  
      console.log('Valor Nominal:', this.valorNominal);
      console.log('Valor Neto:', this.valorNeto);
      console.log('Descuento:', descuento);
    } else {
      console.warn('Faltan datos para calcular el descuento.');
      this.showTCEASection = false; // Asegurar que no se muestre si no hay cálculo
    }
  }
  calcularTCEA(): void {
    if (this.valorNeto !== null && this.valorNominal !== null && this.diasDiferencia !== null) {
      // Aplicar la fórmula para calcular la TCEA
      const TCEA = Math.pow(this.valorNominal / this.valorNeto, 360 / this.diasDiferencia) - 1;
  
      // Asignar el resultado
      this.TCEAResultado = TCEA;
  
      // Habilitar el botón de registro
      this.showRegisterButton = true;
  
      console.log('TCEA Calculada:', TCEA);
    } else {
      console.warn('Faltan datos para calcular la TCEA.');
      this.showRegisterButton = false; // Deshabilitar el botón si faltan datos
    }
  }

  confirmChange(tipo: string): void {
    const confirmChange = confirm('¿Estás seguro de cambiar los datos?');
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

  clearCalculations(): void {
    this.tasaResultado = null;
    this.diasDiferencia = null;
    this.valorNominal = null;
    this.valorNeto = null;
  }

  disableSections(): void {
    this.showRateSelection = false;
    this.showSections = false;
  }

  registrarContrato(): void {
    if (
      this.selectedDocumento &&
      this.selectedBanco &&
      this.valorNominal !== null &&
      this.valorNeto !== null &&
      this.diasDiferencia !== null &&
      this.TCEAResultado !== null && // Ahora incluye la TCEA
      this.tasaResultado !== null
    ) {
      // Crear una instancia de Contrato
      const contrato = new Contrato();
      contrato.currency = this.selectedDocumento.currency || ''; // Moneda del documento
      contrato.valorNominal = this.valorNominal; // Valor nominal del contrato
      contrato.valorDescontado = this.valorNominal - this.valorNeto; // Diferencia entre valor nominal y neto
      contrato.valorRecibido = this.valorNeto; // Valor neto recibido
      contrato.dias = this.diasDiferencia; // Días de la operación
      contrato.tep = this.TCEAResultado * 100; // TCEA calculada
      contrato.tipoTasa = this.tasaOpcion === 'efectiva' ? 'Efectiva' : 'Nominal'; // Tipo de tasa seleccionada
      contrato.valorTasa = this.tasaResultado; // Valor de la tasa seleccionada
      contrato.estado = 'FIRMADO'; // Estado inicial del contrato
      contrato.documento = this.selectedDocumento; // Relación con el documento seleccionado
      contrato.banco = this.selectedBanco; // Relación con el banco seleccionado
  
      // Llamar al servicio para registrar el contrato
      this.contratoService.insert(contrato).subscribe(
        (response) => {
          console.log('Contrato registrado exitosamente:', response);
  
          // Cambiar el estado del documento a "DESCONTADO"
          if (this.selectedDocumento) {
            const documentoActualizado = { ...this.selectedDocumento, estado: 'DESCONTADO' }; // Crear una copia con el estado actualizado
            this.documentoService.modifyStatus(documentoActualizado).subscribe(
              () => {
                alert('El registro se hizo correctamente');
                console.log('Estado del documento actualizado a "DESCONTADO".');
              },
              (error) => {
                console.error('Error al actualizar el estado del documento:', error);
              }
            );
          }
  
          // Mensaje de éxito
          alert('Contrato registrado con éxito.');
          // Limpieza de los datos del formulario
          this.clearCalculations();
          this.disableSections();
          this.showRegisterButton = false; // Ocultar el botón de registro
        },
        (error) => {
          console.error('Error al registrar el contrato:', error);
          alert('Hubo un error al registrar el contrato.');
        }
      );
    } else {
      console.warn('Faltan datos para registrar el contrato.');
    }
  }
  
}