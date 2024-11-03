import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {MatDialog,MatDialogModule } from '@angular/material/dialog';
import { Empresa } from '../../../models/empresa';
import { EmpresaComponent } from '../empresa.component';
import { EmpresaService } from '../../../services/empresa.service';
import { LoginService } from '../../../services/login.service';
import { MatCardModule } from '@angular/material/card';
import { Router } from 'express';
import { CommonModule } from '@angular/common';
import { EmpresasUsuarioComponent } from '../empresas-usuario/empresas-usuario.component';
@Component({
  selector: 'app-lista-empresa',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatDialogModule , MatCardModule, MatInputModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule],
  templateUrl: './lista-empresa.component.html',
  styleUrl: './lista-empresa.component.css'
})
export class ListaEmpresaComponent implements OnInit{
  dataSource: Empresa[] = [];
  filteredDataSource: Empresa[] = [];
  filterValue: string = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private empService: EmpresaService,
    private _matDialog: MatDialog,
    public loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.empService.list().subscribe((data) => {
      this.dataSource = data;
      this.filteredDataSource = data; // Inicializamos filteredDataSource con todos los datos
    });
  }

  // Filtra la lista de empresas por varios campos (nombre, usuario, dirección, ruc y tipo)
  filter(event: any) {
    this.filterValue = event.target.value.trim().toLowerCase();
    this.filteredDataSource = this.dataSource.filter((empresa) =>
      empresa.nombre.toLowerCase().includes(this.filterValue) ||
      empresa.usuario.nombre.toLowerCase().includes(this.filterValue) ||
      empresa.direccion.toLowerCase().includes(this.filterValue) ||
      empresa.ruc.toString().includes(this.filterValue) ||
      empresa.tipo.toLowerCase().includes(this.filterValue)
    );
  }

  // Abre el diálogo con la información de la empresa seleccionada
  openDialog(empresaId: number): void {
    this.empService.listId(empresaId).subscribe((empresa) => {
      this._matDialog.open(EmpresasUsuarioComponent, {
        width: '400px',
        data: empresa
      });
    });
  }

  // Redirige al componente de registro de empresas (si implementado)
  navigateToRegister(): void {
    // Implementar la lógica de navegación a registro
  }
}
