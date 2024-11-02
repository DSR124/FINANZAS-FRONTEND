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

  tipoDocumentoOpciones = [
    { value: 'LETRAS', viewValue: 'Letras' },
    { value: 'FACTURAS', viewValue: 'Facturas' }
  ];

  estadoOpciones = [
    { value: 'ACTIVO', viewValue: 'Activo' },
    { value: 'NO ACTIVO', viewValue: 'No Activo' }
  ];

  monedaOpciones = [
    { value: 'USD', viewValue: 'Dólares' },
    { value: 'PEN', viewValue: 'Soles' }
  ];

  constructor(
    private documentoService: DocumentoService,
    private carteraService: CarteraService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      tipoDocumento: ['', [Validators.required]],
      valorDocumento: ['', [Validators.required, Validators.min(0.01)]],
      currency: ['', [Validators.required]],
      fechaEmision: ['', [Validators.required]],
      fechaVencimiento: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      clienteNombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      clientePhone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      cartera: ['', [Validators.required]]
    });

    // Load carteras
    this.carteraService.list().subscribe((data) => {
      this.listaCarteras = data;
    });
  }

  init() {
    if (this.edicion) {
      this.documentoService.listId(this.id).subscribe((data) => {
        this.form.patchValue({
          tipoDocumento: data.tipoDocumento,
          valorDocumento: data.valorDocumento,
          currency: data.currency,
          fechaEmision: data.fechaEmision,
          fechaVencimiento:  data.fechaVencimiento,
          estado: data.estado,
          clienteNombre: data.clienteNombre,
          clientePhone: data.clientePhone,
          cartera: data.cartera.idCartera
        });
      });
    }
  }

  registrar() {
    if (this.form.valid) {
      this.documento =    this.form.value;
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
    } else {
      this.mensaje = 'Complete todos los campos correctamente';
    }
  }

  confirmCancel() {
    const confirmed = window.confirm('¿Estás seguro de que quieres cancelar?');
    if (confirmed) {
      // Acciones a tomar en caso de cancelar
    }
  }
}
