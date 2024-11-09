import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DocumentoByCartera } from '../../../models/DocumentobyCartera';
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
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-listar-documento-usuario',
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
    MatDialogModule,
    MatOptionModule
  ],
  templateUrl: './listar-documento-usuario.component.html',
  styleUrl: './listar-documento-usuario.component.css'
})
export class ListarDocumentoUsuarioComponent {
  dataSource: MatTableDataSource<DocumentoByCartera>;
  displayedColumns: string[] = [
    'idCartera',
    'nombreCartera',
    'fechaDescuento',
    'moneda',
    'idDocumento',
    'fechaEmision',
    'fechaVencimiento',
    'valorDocumento',
    'clienteNombre',
    'clientePhone',
    'documentoCurrency',
    'estado',
    'tipoDocumento',
    'acciones' // Columna para las acciones (como eliminar)
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<ListarDocumentoUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public documentos: DocumentoByCartera[],
    private documentoService: DocumentoService // Inyección del servicio DocumentoService
  ) {
    this.dataSource = new MatTableDataSource(documentos);
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  // Método para eliminar un documento
  eliminarDocumento(documento: DocumentoByCartera): void {
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
