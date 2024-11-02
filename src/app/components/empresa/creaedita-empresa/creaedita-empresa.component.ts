import { Component } from '@angular/core';
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
export class CreaeditaEmpresaComponent {
  
  form: FormGroup = new FormGroup({});
  empresa: Empresa = new Empresa();
  mensaje: string = '';
  listaUsuarios: Usuario[] = [];
  id: number = 0;
  edicion: boolean = false;
  role: string = '';

  tipoempresa: { value: string; viewValue: string }[] = [
    { value: 'PYME', viewValue: 'Pyme' },
    { value: 'Mediana', viewValue: 'Mediana' },
  ];
  constructor(
    private eS: EmpresaService,
    private uS: UsuarioService,
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
      Tipo:['',Validators.required],
      Ruc: ['', [Validators.required, numeropositvo]],
      Direccion:['',Validators.required],
      usuario:['',Validators.required],
    });
    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data;
    });

    
  }

  init() {
    if (this.edicion) {
      this.eS.listId(this.id).subscribe((data) => {
        this.form.patchValue({
          idEmpresa: data.idEmpresa,
          nombre: data.nombre,
          Tipo: data.tipo,
          Ruc: data.ruc,
          Direccion: data.direccion,
          usuario: data.usuario.idUsuario
        });
      });
    }
  }
  registrar() {
    if (this.form.valid) {
      this.empresa.idEmpresa=this.id
      this.empresa.nombre=this.form.value.nombre
      this.empresa.tipo=this.form.value.Tipo
      this.empresa.ruc=this.form.value.Ruc
      this.empresa.direccion=this.form.value.Direccion
      this.empresa.usuario.idUsuario=this.form.value.usuario
      
      this.empresa.usuario.idUsuario = this.form.value.usuario;
      if (this.edicion) {
        this.eS.update(this.empresa).subscribe(() => {
          this.eS.list().subscribe((data) => {
            this.eS.setList(data);
          });
        });
        alert('La modificacion se hizo correctamente');
      } else {
        this.eS.insert(this.empresa).subscribe((data) => {
          this.eS.list().subscribe((data) => {
            this.eS.setList(data);
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
