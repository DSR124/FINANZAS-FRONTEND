
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DocumentoService } from '../../../services/documento.service';
import { Documento } from '../../../models/documento';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


@Component({
  selector: 'app-listar-documento',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './listar-documento.component.html',
  styleUrl: './listar-documento.component.css'
})
export class ListarDocumentoComponent implements OnInit {
  displayedColumns: string[] = [
    'tipoDocumento',
    'valorDocumento',
    'currency',
    'fechaEmision',
    'fechaVencimiento',
    'estado',
    'clienteNombre',
    'cartera',
    'clientePhone',
    'acciones' // Columna para acciones como eliminar
  ];
  dataSource: MatTableDataSource<Documento> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private documentoService: DocumentoService) {}

  ngOnInit(): void {
    this.documentoService.list().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Método para eliminar un documento
  eliminarDocumento(documento: Documento): void {
    if (confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      this.documentoService.delete(documento.idDocumento).subscribe(
        () => {
          // Actualiza la tabla eliminando el documento localmente
          this.dataSource.data = this.dataSource.data.filter(d => d.idDocumento !== documento.idDocumento);
          alert('Documento eliminado correctamente');
        },
        (error) => {
          console.error('Error al eliminar el documento:', error);
          alert('Hubo un error al intentar eliminar el documento');
        }
      );
    }
  }
}
