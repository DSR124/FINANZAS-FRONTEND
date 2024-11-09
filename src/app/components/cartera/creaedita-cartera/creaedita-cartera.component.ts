import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Empresa } from '../../../models/empresa';
import { EmpresaService } from '../../../services/empresa.service';
import { ActivatedRoute, Params, RouterModule} from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { Cartera } from '../../../models/cartera';
import { CarteraService } from '../../../services/cartera.service';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-creaedita-cartera',
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
  templateUrl: './creaedita-cartera.component.html',
  styleUrl: './creaedita-cartera.component.css'
})
export class CreaeditaCarteraComponent {
  form: FormGroup = new FormGroup({});
  cartera: Cartera = new Cartera();
  mensaje: string = '';
  listaEmpresas: Empresa[] = [];
  id: number = 0;
  edicion: boolean = false;
  monedas = [
    { value: 'PEN', viewValue: 'Soles' },
    { value: 'USD', viewValue: 'Dólares' }
  ];
  constructor(
    private cS: CarteraService,
    private eS: EmpresaService,
    private formBuilder: FormBuilder,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });
  
    this.form = this.formBuilder.group({
      fechaDescuento: ['', Validators.required],
      tcea: [{ value: 0, disabled: true }], // Inicializa TCEA con 0 y deshabilitado
      fechaCreacion: [new Date(), Validators.required], // Fecha de creación con la fecha actual
      empresa: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      moneda: ['', Validators.required]
    });
  
    this.eS.list().subscribe((data) => {
      this.listaEmpresas = data;
    });
  }

  init() {
    if (this.edicion) {
      this.cS.listId(this.id).subscribe((data) => {
        this.form.patchValue({
          idCartera: data.idCartera,
          fechaDescuento: data.fechaDescuento,
          tcea: data.tcea,
          fechaCreacion: data.fechaCreacion,
          empresa: data.empresa.idEmpresa,
          nombre: data.nombre,
          moneda: data.moneda
        });
      });
    }
  }

  registrar() {
    if (this.form.valid) {
      this.cartera.idCartera = this.id;
      this.cartera.fechaDescuento = this.form.value.fechaDescuento;
      this.cartera.tcea = this.form.value.tcea;
      this.cartera.fechaCreacion = this.form.value.fechaCreacion;
      this.cartera.empresa.idEmpresa = this.form.value.empresa;
      this.cartera.nombre = this.form.value.nombre;
      this.cartera.moneda = this.form.value.moneda;

      if (this.edicion) {
        this.cS.update(this.cartera).subscribe(() => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
        alert('La modificación se hizo correctamente');
      } else {
        this.cS.insert(this.cartera).subscribe((data) => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
        alert('El registro se hizo correctamente');
        this.ngOnInit();
      }
    } else {
      this.mensaje = 'Complete todos los campos!!!';
    }
  }
  obtenerControlCampo(nombreCampo: string): AbstractControl {
    const control = this.form.get(nombreCampo);
    if (!control) {
      throw new Error(`Control no encontrado para el campo ${nombreCampo}`);
    }
    return control;
  }
  confirmCancel() {
    const confirmed = window.confirm('¿Estás seguro de que quieres cancelar?');
    if (confirmed) {
      this.ngOnInit()
    }
  }
}
