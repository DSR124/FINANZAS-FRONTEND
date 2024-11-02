import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { Rol } from '../../../models/rol';
import { UsuarioService } from '../../../services/usuario.service';
import { RolService } from '../../../services/rol.service';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-crea-rol',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatButtonModule, MatInputModule, RouterLink,

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIcon,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    MatCheckboxModule,
    RouterModule

  ],
  templateUrl: './crea-rol.component.html',
  styleUrl: './crea-rol.component.css'
})
export class CreaRolComponent {
  form: FormGroup = new FormGroup({});
  idUsuario: number | undefined;
  rol: Rol = new Rol();

  constructor(
    private uS: UsuarioService,
    private roleService: RolService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      seleccion: ['', Validators.required],
    });
  }

  roles: { value: string; viewValue: string }[] = [
    { value: 'ADMINISTRADOR', viewValue: 'Administrador' },
    { value: 'USUARIO', viewValue: 'Usuario' },
  ];

  ngOnInit(): void {
    // Obtiene el ID del último usuario registrado para asignarle un rol
    this.uS.encontrarUltimoUsuario().subscribe(
      (ultimoUsuarioId) => {
        this.idUsuario = ultimoUsuarioId;
        console.log('Último ID de usuario:', this.idUsuario);
      },
      (error) => {
        console.error('Error al obtener último usuario:', error);
      }
    );
  }

  register() {
    if (this.form.valid && this.idUsuario !== undefined) {
      this.rol.usuario = { idUsuario: this.idUsuario } as unknown as Usuario;
      this.rol.nombreRol = this.form.value.seleccion;

      // Inserta el rol en el backend
      this.roleService.insert(this.rol).subscribe(
        (res) => {
          console.log('Rol registrado correctamente:', res);
          alert('Rol asignado exitosamente');
          this.router.navigate(['/login']); // Navega a la página de inicio o destino deseado
        },
        (error) => {
          console.error('Error al registrar rol:', error);
        }
      );
    } else {
      alert('Seleccione un rol antes de continuar.');
    }
  }
}

