import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Empresa } from '../../../models/empresa';
import { Usuario } from '../../../models/usuario';
import { EmpresaService } from '../../../services/empresa.service';
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
import { Router } from '@angular/router';



function numeropositvo(control: FormControl) {
  const precio = control.value;
  if (isNaN(precio) || precio <= 0) {
    return { precioNoValido: true };
  }
  return null;
}

@Component({
  selector: 'app-creaedita-empresa',
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
    MatSelectModule

  ],
  templateUrl: './creaedita-empresa.component.html',
  styleUrl: './creaedita-empresa.component.css'
})
export class CreaeditaEmpresaComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  empresa: Empresa = new Empresa();
  mensaje: string = '';
  usuarioActual: Usuario | null = null; // Usuario actual
  idUsuarioActual: number | null = null; // ID del usuario actual
  usernameActual: string = ''; // Username del usuario actual
  edicion: boolean = false;

  tipoempresa: { value: string; viewValue: string }[] = [
    { value: 'PYME', viewValue: 'Pyme' },
    { value: 'Mediana', viewValue: 'Mediana' },
  ];

  constructor(
    private eS: EmpresaService,
    private uS: UsuarioService,
    private formBuilder: FormBuilder,
    public route: ActivatedRoute,
    private router: Router,

    private loginService: LoginService // Agregamos el LoginService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.edicion = data['id'] != null;
      this.init();
    });

    // Inicializa el formulario
    this.form = this.formBuilder.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/)],
      ],
      Tipo: ['', Validators.required],
      Ruc: ['', [Validators.required, numeropositvo]],
      Direccion: ['', Validators.required],
      usuario: [{ value: '', disabled: false }, Validators.required], // Campo deshabilitado
    });

    // Obtén el username del usuario actual desde el token
    const username = this.loginService.getUsername();
    if (username) {
      this.usernameActual = username; // Almacena el username
      // Busca el usuario por username
      this.uS.buscarPorUsername(username).subscribe((usuario) => {
        this.usuarioActual = usuario;
        this.idUsuarioActual = usuario.idUsuario; // Almacena el ID del usuario
        // Muestra el username en el formulario
        this.form.patchValue({ usuario: this.usernameActual });
      });
    }
  }

  init() {
    if (this.edicion) {
      this.eS.listId(this.idUsuarioActual!).subscribe((data) => {
        this.form.patchValue({
          nombre: data.nombre,
          Tipo: data.tipo,
          Ruc: data.ruc,
          Direccion: data.direccion,
          usuario: this.usernameActual,
        });
      });
    }
  }

  registrar() {
    if (this.form.valid && this.idUsuarioActual) {
      // Asigna los valores del formulario a la empresa
      this.empresa.nombre = this.form.value.nombre;
      this.empresa.tipo = this.form.value.Tipo;
      this.empresa.ruc = this.form.value.Ruc;
      this.empresa.direccion = this.form.value.Direccion;
      this.empresa.usuario = { idUsuario: this.idUsuarioActual } as Usuario; // Asocia el usuario por ID

      if (this.edicion) {
        this.eS.update(this.empresa).subscribe(() => {
          this.eS.list().subscribe((data) => {
            this.eS.setList(data);
          });
        });
        alert('La modificación se hizo correctamente');
      } else {
        this.eS.insert(this.empresa).subscribe(() => {
          this.eS.list().subscribe((data) => {
            this.eS.setList(data);
          });
        });
        alert('El registro se hizo correctamente');
        this.ngOnInit();
        this.router.navigate(['/empresa/listar_empresa']);

      }
    } else {
      this.mensaje = '¡Complete todos los campos!';
    }
  }

  confirmCancel() {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres cancelar?'
    );
    if (confirmed) {
      // Lógica para cancelar
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
