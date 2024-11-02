import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
  templateUrl: './empresas-usuario.component.html',
  styleUrl: './empresas-usuario.component.css'
})
export class EmpresasUsuarioComponent  {
  displayedColumns: string[] = ['id', 'nombre', 'direccion', 'ruc', 'tipo'];
  dataSource: MatTableDataSource<Empresa> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private empresaService: EmpresaService) { }

  
  

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
