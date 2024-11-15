import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { EliminarDocComponent } from '../eliminar-doc/eliminar-doc.component';

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
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<ListarDocumentoUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public documentos: DocumentoByCartera[],
    private documentoService: DocumentoService,
    private dialog: MatDialog // Inyección del servicio DocumentoService
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

}
