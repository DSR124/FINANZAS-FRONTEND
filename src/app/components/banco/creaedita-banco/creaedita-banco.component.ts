import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

function numeroPositivo(control: AbstractControl) {
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
export class CreaeditaBancoComponent  implements OnInit{
  form: FormGroup = new FormGroup({});
  banco: Banco = new Banco();
  mensaje: string = '';
  id: number = 0;
  edicion: boolean = false;
  imageSelected: string | ArrayBuffer | null = null;

  constructor(
    private bS: BancoService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const today = new Date(); // Obtiene la fecha actual
  
    this.form = this.formBuilder.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/)],
      ],
      imageUrl: ['', Validators.required],
      balance: ['', [Validators.required, numeroPositivo]],
      tasaNomninal: ['', [Validators.required, numeroPositivo]],
      tasaEfectiva: ['', [Validators.required, numeroPositivo]],
      comisionExtra: ['', [Validators.required, numeroPositivo]],
      creationDate: [{ value: today, disabled: false }, Validators.required], // Deshabilita el campo y asigna la fecha actual
    });
  
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;
      this.init();
    });
  }
  init() {
    if (this.edicion) {
      this.bS.listId(this.id).subscribe((data) => {
        this.form.patchValue({
          nombre: data.nombre,
          imageUrl: data.imageUrl,
          balance: data.balance,
          tasaNomninal: data.tasaNomninal,
          tasaEfectiva: data.tasaEfectiva,
          comisionExtra: data.cosionExtra,
          creationDate: data.creationDate,
        });
        this.imageSelected = data.imageUrl;
      });
    }
  }

  registrar() {
    if (this.form.valid) {
      // Habilita temporalmente el campo 'creationDate' para incluirlo en la solicitud
      this.form.get('creationDate')?.enable();
  
      const bancoData: Banco = {
        ...this.form.value,
        idBanco: this.edicion ? this.id : undefined,
        imageUrl: this.form.value.imageUrl,
      };
  
      if (this.edicion) {
        this.bS.update(bancoData).subscribe(
          () => {
            alert('La modificación se hizo correctamente');
          },
          (error) => {
            console.error('Error al actualizar el banco:', error);
          }
        );
      } else {
        this.bS.insert(bancoData).subscribe(
          () => {
            alert('El registro se hizo correctamente');
          },
          (error) => {
            console.error('Error al registrar el banco:', error);
          }
        );
      }
  
      // Desactiva nuevamente el campo 'creationDate'
      this.form.get('creationDate')?.disable();
    } else {
      this.mensaje = 'Complete todos los campos correctamente';
    }
  }

  confirmCancel() {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres cancelar?'
    );
    if (confirmed) {
      this.ngOnInit();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Content = reader.result?.toString().split(',')[1];
          if (base64Content) {
            this.form.get('imageUrl')?.setValue(base64Content);
            this.imageSelected = base64Content;
            this.cdr.detectChanges();
          } else {
            console.log(
              'Error al extraer el contenido base64 de la imagen.'
            );
          }
        };
        reader.readAsDataURL(file);
      } else {
        console.log('El archivo seleccionado no es una imagen.');
      }
    }
  }

  imagenNoCargada(event: Event) {
    const imagen = event.target as HTMLImageElement;
    imagen.src = 'assets/image/EstacionamientoDefault.jpg';
  }

  getImagenUrl(): string {
    if (this.imageSelected) {
      return 'data:image/jpeg;base64,' + this.imageSelected;
    } else {
      return 'assets/image/EstacionamientoDefault.jpg';
    }
  }
}
