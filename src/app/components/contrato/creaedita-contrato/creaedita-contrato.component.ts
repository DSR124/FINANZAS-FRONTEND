import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ContratoService } from '../../../services/contrato.service';
import { DocumentoService } from '../../../services/documento.service';
import { BancoService } from '../../../services/banco.service';

import { Contrato } from '../../../models/contrato';
import { Documento } from '../../../models/documento';
import { Banco } from '../../../models/banco';
@Component({
  selector: 'app-creaedita-contrato',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './creaedita-contrato.component.html',
  styleUrl: './creaedita-contrato.component.css'
})
export class CreaeditaContratoComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  contrato: Contrato = new Contrato();
  listaDocumentos: Documento[] = [];
  listaBancos: Banco[] = [];
  id: number = 0;
  edicion: boolean = false;
  mensaje: string = '';

  tipoTasaOpciones = [
    { value: 'EFECTIVA', viewValue: 'Efectiva' },
    { value: 'NOMINAL', viewValue: 'Nominal' }
  ];

  constructor(
    private contratoService: ContratoService,
    private documentoService: DocumentoService,
    private bancoService: BancoService,
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
      fechaCompra: ['', [Validators.required]],
      fechaPago: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      valorNominal: ['', [Validators.required, Validators.min(0.01)]],
      tasaDescontada: ['', [Validators.required, Validators.min(0.01)]],
      valorRecibido: ['', [Validators.required, Validators.min(0.01)]],
      dias: ['', [Validators.required, Validators.min(1)]],
      tep: ['', [Validators.required, Validators.min(0.01)]],
      tipoTasa: ['', [Validators.required]],
      valorTasa: ['', [Validators.required, Validators.min(0.01)]],
      estado: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      banco: ['', [Validators.required]]
    });

    // Load documentos and bancos
    this.documentoService.list().subscribe((data) => {
      this.listaDocumentos = data;
    });
    this.bancoService.list().subscribe((data) => {
      this.listaBancos = data;
    });
  }

  init() {
    if (this.edicion) {
      this.contratoService.listId(this.id).subscribe((data) => {
        this.form.patchValue({
          currency: data.currency,
          valorNominal: data.valorNominal,
          tasaDescontada: data.tasaDescontada,
          valorRecibido: data.valorRecibido,
          dias: data.dias,
          tep: data.tep,
          tipoTasa: data.tipoTasa,
          valorTasa: data.valorTasa,
          estado: data.estado,
          documento: data.documento.idDocumento,
          banco: data.banco.idBanco
        });
      });
    }
  }

  registrar() {
    if (this.form.valid) {
      this.contrato = this.form.value;
      this.contrato.documento = { idDocumento: this.form.value.documento } as Documento;
      this.contrato.banco = { idBanco: this.form.value.banco } as Banco;

      if (this.edicion) {
        this.contrato.id = this.id;
        this.contratoService.update(this.contrato).subscribe(() => {
          alert('El contrato ha sido actualizado correctamente');
        });
      } else {
        this.contratoService.insert(this.contrato).subscribe(() => {
          alert('El contrato ha sido registrado correctamente');
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
