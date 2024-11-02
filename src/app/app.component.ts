import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';

import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion'; 
import {MatBadgeModule} from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
/* Módulos de Angular Material */
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from './components/login/login.component';
import { LoginService } from './services/login.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LoadingComponent } from './components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule, 
    MatExpansionModule,
    MatBadgeModule,
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    LoadingComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TF-FINANZAS-FRONT';
  role: string = '';
  cantidadEnCarrito: number = 0
  constructor(private loginService:LoginService,
  ){}
  ngOnInit(): void { 
    const role = this.loginService.showRole();
    console.log('Rol del usuario:', role);

  }
    verificar() {
    return this.loginService.verificar();
  }
  cerrar() {
    sessionStorage.clear();
  }
}
