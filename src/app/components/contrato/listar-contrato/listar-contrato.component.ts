import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { Contrato } from '../../../models/contrato';
import { ContratoService } from '../../../services/contrato.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listar-contrato',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    
  ],
  templateUrl: './listar-contrato.component.html',
  styleUrl: './listar-contrato.component.css'
})
export class ListarContratoComponent implements OnInit{
  displayedColumns: string[] = [
    'id',
    'currency',
    'valorNominal',
    'valorRecibido',
    'dias',
    'tep',
    'tipoTasa',
    'valorTasa',
    'estado',
    'documento',
    'banco',
  ];
  dataSource: MatTableDataSource<Contrato> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private contratoService: ContratoService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const username = this.loginService.getUsername(); // Obtener el username desde el token

    if (username) {
      // Llamar al servicio para obtener contratos por usuario
      this.contratoService.listByUser(username).subscribe(
        (data) => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error) => {
          console.error('Error al obtener contratos por usuario:', error);
        }
      );
    } else {
      console.error('No se pudo obtener el nombre de usuario del token.');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
