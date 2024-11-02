import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
@Component({
  selector: 'app-sing-in',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './sing-in.component.html',
  styleUrl: './sing-in.component.css'
})
export class SingInComponent {
  form: FormGroup = new FormGroup({});
  usuario: Usuario = new Usuario();

  constructor(
    private uS: UsuarioService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      enabled: [true]
    });
  }

  async registrar() {
    if (this.form.valid) {
      // Mapear los datos del formulario al modelo de Usuario
      this.usuario.nombre = this.form.value.nombre;
      this.usuario.apellido = this.form.value.apellido;
      this.usuario.correo = this.form.value.correo;
      this.usuario.username = this.form.value.username;
      this.usuario.enabled = this.form.value.enabled;
      this.usuario.password = this.form.value.password;


      // Enviar la solicitud de registro al backend
      this.uS.insert(this.usuario).subscribe(
        (data) => {
          console.log('Usuario registrado correctamente:', data);
          this.router.navigate(['/rol']); // Redirigir al login después de registrar
        },
        (error) => {
          console.error('Error al registrar usuario:', error);
        }
      );
    } else {
      console.log('Formulario no válido.');
    }
  }
}
