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
    'banco'
  ];
  dataSource: MatTableDataSource<Contrato> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private contratoService: ContratoService) {}

  ngOnInit(): void {
    this.contratoService.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.contratoService.getList().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
