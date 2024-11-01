import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { ActivatedRoute, Params, RouterModule} from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { Banco } from '../../../models/banco';
import { BancoService } from '../../../services/banco.service';
import { MatDatepickerModule } from '@angular/material/datepicker';

function numeroPositivo(control: FormControl) {
  const valor = control.value;
  if (isNaN(valor) || valor <= 0) {
    return { valorNoValido: true };
  }
  return null;
}
@Component({
  selector: 'app-creaedita-banco',
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
  templateUrl: './creaedita-banco.component.html',
  styleUrl: './creaedita-banco.component.css'
})
export class CreaeditaBancoComponent {

  form: FormGroup = new FormGroup({});
  banco: Banco = new Banco();
  mensaje: string = '';
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private bS: BancoService,
    private formBuilder: FormBuilder,
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/)]],
      imageUrl: ['', Validators.required],
      balance: ['', [Validators.required, numeroPositivo]],
      tasaNomninal: ['', [Validators.required, numeroPositivo]],
      tasaEfectiva: ['', [Validators.required, numeroPositivo]],
      cosionExtra: ['', [Validators.required, numeroPositivo]],
      creationDate: ['', Validators.required]
    });
  }

  init() {
    if (this.edicion) {
      this.bS.listId(this.id).subscribe((data) => {
        this.form.patchValue({
          idBanco: data.idBanco,
          nombre: data.nombre,
          imageUrl: data.imageUrl,
          balance: data.balance,
          tasaNomninal: data.tasaNomninal,
          tasaEfectiva: data.tasaEfectiva,
          cosionExtra: data.cosionExtra,
          creationDate: data.creationDate
        });
      });
    }
  }

  registrar() {
    if (this.form.valid) {
      this.banco.idBanco = this.id;
      this.banco.nombre = this.form.value.nombre;
      this.banco.imageUrl = this.form.value.imageUrl;
      this.banco.balance = this.form.value.balance;
      this.banco.tasaNomninal = this.form.value.tasaNomninal;
      this.banco.tasaEfectiva = this.form.value.tasaEfectiva;
      this.banco.cosionExtra = this.form.value.cosionExtra;
      this.banco.creationDate = this.form.value.creationDate;

      if (this.edicion) {
        this.bS.update(this.banco).subscribe(() => {
          this.bS.list().subscribe((data) => {
            this.bS.setList(data);
          });
        });
        alert('La modificación se hizo correctamente');
      } else {
        this.bS.insert(this.banco).subscribe((data) => {
          this.bS.list().subscribe((data) => {
            this.bS.setList(data);
          });
        });
        alert('El registro se hizo correctamente');
        this.ngOnInit();
      }
    } else {
      this.mensaje = 'Complete todos los campos!!!';
    }
  }

  confirmCancel() {
    const confirmed = window.confirm('¿Estás seguro de que quieres cancelar?');
    if (confirmed) {
      // Acción a realizar en caso de confirmación de cancelación
    }
  }

  obtenerControlCampo(nombreCampo: string): AbstractControl {
    const control = this.form.get(nombreCampo);
    if (!control) {
      throw new Error(`Control no encontrado para el campo ${nombreCampo}`);
    }
    return control;
  }
}
