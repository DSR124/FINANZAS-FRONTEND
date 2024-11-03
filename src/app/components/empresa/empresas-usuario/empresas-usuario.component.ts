import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Empresa } from '../../../models/empresa';
import { EmpresaService } from '../../../services/empresa.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-empresas-usuario',
  standalone: true,
  imports: [
    MatFormFieldModule, MatDialogModule, MatInputModule, RouterModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule
  ],
  template: `
  <h2 mat-dialog-title>Información de Empresa</h2>
  <mat-dialog-content>
    <p><strong>ID:</strong> {{ data.idEmpresa }}</p>
    <p><strong>Nombre:</strong> {{ data.nombre }}</p>
    <p><strong>Usuario:</strong> {{ data.usuario.nombre}} {{ data.usuario.apellido}}</p>
    <p><strong>Dirección:</strong> {{ data.direccion }}</p>
    <p><strong>RUC:</strong> {{ data.ruc }}</p>
    <p><strong>Tipo:</strong> {{ data.tipo }}</p>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>Cerrar</button>
  </mat-dialog-actions>
`,
  styleUrl: './empresas-usuario.component.css'
})
export class EmpresasUsuarioComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Empresa) {}

}
