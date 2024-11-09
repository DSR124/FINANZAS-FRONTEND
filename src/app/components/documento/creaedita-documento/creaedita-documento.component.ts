import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, RouterModule} from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Documento } from '../../../models/documento';
import { Cartera } from '../../../models/cartera';
import { DocumentoService } from '../../../services/documento.service';
import { CarteraService } from '../../../services/cartera.service';
@Component({
  selector: 'app-creaedita-documento',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './creaedita-documento.component.html',
  styleUrl: './creaedita-documento.component.css'
})
export class CreaeditaDocumentoComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  documento: Documento = new Documento();
  listaCarteras: Cartera[] = [];
  id: number = 0;
  edicion: boolean = false;
  mensaje: string = '';
  formularioActivo: boolean = false; // Controla si el formulario está activo o no

  tipoDocumentoOpciones = [
    { value: 'LETRAS', viewValue: 'Letras' },
    { value: 'FACTURAS', viewValue: 'Facturas' }
  ];

  constructor(
    private documentoService: DocumentoService,
    private carteraService: CarteraService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;
      this.init();
    });

    // Configurar el formulario con validaciones
    this.form = this.formBuilder.group({
      cartera: ['', [Validators.required]],
      tipoDocumento: [{ value: '', disabled: true }, [Validators.required]],
      valorDocumento: [{ value: '', disabled: true }, [Validators.required, Validators.min(0.01)]],
      currency: [{ value: '', disabled: false }, [Validators.required]], // Moneda deshabilitada
      fechaEmision: [{ value: '', disabled: true }, [Validators.required]],
      fechaVencimiento: [{ value: '', disabled: true }, [Validators.required]],
      estado: [{ value: 'ACTIVO', disabled: true }, [Validators.required]], // Estado inicial y deshabilitado
      clienteNombre: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      clientePhone: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });

    // Cargar las carteras disponibles
    this.carteraService.list().subscribe((data) => {
      this.listaCarteras = data;
    });

    // Escuchar cambios en el campo 'cartera'
    this.form.get('cartera')?.valueChanges.subscribe((carteraId) => {
      const carteraSeleccionada = this.listaCarteras.find(c => c.idCartera === carteraId);
      if (carteraSeleccionada) {
        // Actualizar el currency y activar el formulario
        this.form.get('currency')?.setValue(carteraSeleccionada.moneda);
        this.activarFormulario();
      } else {
        this.desactivarFormulario();
      }
    });
  }

  activarFormulario() {
    // Habilitar los campos del formulario excepto 'currency' y 'estado'
    this.formularioActivo = true;
    Object.keys(this.form.controls).forEach((key) => {
      if (key !== 'cartera' && key !== 'currency' && key !== 'estado') {
        this.form.get(key)?.enable();
      }
    });
  }

  desactivarFormulario() {
    // Deshabilitar los campos del formulario
    this.formularioActivo = false;
    Object.keys(this.form.controls).forEach((key) => {
      if (key !== 'cartera') {
        this.form.get(key)?.disable();
      }
    });
  }

  init() {
    if (this.edicion) {
      this.documentoService.listId(this.id).subscribe((data) => {
        this.form.patchValue({
          cartera: data.cartera.idCartera,
          tipoDocumento: data.tipoDocumento,
          valorDocumento: data.valorDocumento,
          currency: data.currency,
          fechaEmision: data.fechaEmision,
          fechaVencimiento: data.fechaVencimiento,
          estado: data.estado,
          clienteNombre: data.clienteNombre,
          clientePhone: data.clientePhone
        });
        this.activarFormulario();
      });
    }
  }
  getRUC(): string {
    const carteraId = this.form.get('cartera')?.value;
    const carteraSeleccionada = this.listaCarteras.find(c => c.idCartera === carteraId);
  
    // Convertir el número a string
    return carteraSeleccionada ? carteraSeleccionada.empresa.ruc.toString() : '';
  }
  
  registrar() {
    if (this.form.valid) {
      // Habilita temporalmente el campo 'estado' para incluirlo en la solicitud
      this.form.get('estado')?.enable();
  
      this.documento = this.form.value;
      this.documento.cartera = { idCartera: this.form.value.cartera } as Cartera;
  
      if (this.edicion) {
        this.documento.idDocumento = this.id;
        this.documentoService.update(this.documento).subscribe(() => {
          alert('El documento ha sido actualizado correctamente');
        });
      } else {
        this.documentoService.insert(this.documento).subscribe(() => {
          alert('El documento ha sido registrado correctamente');
        });
      }
  
      // Desactiva el campo 'estado' nuevamente
      this.form.get('estado')?.disable();
    } else {
      this.mensaje = 'Complete todos los campos correctamente';
    }
  }
  confirmCancel() {
    const confirmed = window.confirm('¿Estás seguro de que quieres cancelar?');
    if (confirmed) {
      this.ngOnInit()
    }
  }
}
