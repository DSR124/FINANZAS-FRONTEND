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
  form: FormGroup;
  documento: Documento = new Documento();
  listaCarteras: Cartera[] = [];
  id: number = 0;
  edicion: boolean = false;
  mensaje: string = '';
  formularioActivo: boolean = false;
  username: string = '';
  tipoDocumentoOpciones = [
    { value: 'LETRAS', viewValue: 'Letras' },
    { value: 'FACTURAS', viewValue: 'Facturas' }
  ];

  constructor(
    private documentoService: DocumentoService,
    private carteraService: CarteraService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private loginService: LoginService
  ) {
    this.form = this.formBuilder.group({
      cartera: ['', Validators.required],
      tipoDocumento: [{ value: '', disabled: true }, Validators.required],
      valorDocumento: [{ value: '', disabled: true }, [Validators.required, Validators.min(0.01)]],
      currency: [{ value: '', disabled: false }, Validators.required],
      fechaEmision: [{ value: '', disabled: true }, Validators.required],
      fechaVencimiento: [{ value: '', disabled: true }, Validators.required],
      estado: [{ value: 'NO DESCONTADO', disabled: true }, Validators.required],
      clienteNombre: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      clientePhone: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  ngOnInit(): void {
    this.username = this.loginService.getUsername() || '';

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;
      this.init();
    });

    this.cargarCarterasPorUsuario();

    this.form.get('cartera')?.valueChanges.subscribe((carteraId) => {
      const carteraSeleccionada = this.listaCarteras.find(c => c.idCartera === carteraId);
      if (carteraSeleccionada) {
        this.form.get('currency')?.setValue(carteraSeleccionada.moneda);
        this.activarFormulario();
      } else {
        this.desactivarFormulario();
      }
    });
  }

  cargarCarterasPorUsuario(): void {
    this.carteraService.getCarteraSummaryByUsername(this.username).subscribe((data) => {
      this.listaCarteras = data.map(carteraResumen => ({
        idCartera: carteraResumen.idCartera,
        nombre: carteraResumen.nombreCartera,
        moneda: carteraResumen.moneda
      })) as Cartera[];
    });
  }

  activarFormulario(): void {
    this.formularioActivo = true;
    Object.keys(this.form.controls).forEach((key) => {
      if (key !== 'cartera' && key !== 'currency' && key !== 'estado') {
        this.form.get(key)?.enable();
      }
    });
  }

  desactivarFormulario(): void {
    this.formularioActivo = false;
    Object.keys(this.form.controls).forEach((key) => {
      if (key !== 'cartera') {
        this.form.get(key)?.disable();
      }
    });
  }

  init(): void {
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

  registrar(): void {
    if (this.form.valid) {
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

      this.form.get('estado')?.disable();
    } else {
      this.mensaje = 'Complete todos los campos correctamente';
    }
  }

  confirmCancel(): void {
    const confirmed = window.confirm('¿Estás seguro de que quieres cancelar?');
    if (confirmed) {
      this.ngOnInit();
    }
  }
}