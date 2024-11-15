
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
import { LoginService } from '../../../services/login.service';
import { EliminarDocComponent } from '../eliminar-doc/eliminar-doc.component';
import { MatDialog } from '@angular/material/dialog';


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
    'acciones' // Column for actions like delete
  ];
  dataSource: MatTableDataSource<Documento> = new MatTableDataSource();
  username: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private documentoService: DocumentoService,
    private loginService: LoginService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.username = this.loginService.getUsername() || '';

    this.documentoService.listByUsername(this.username).subscribe(
      (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error al obtener los documentos:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminarDocumento(documento: Documento): void {
    const dialogRef = this.dialog.open(EliminarDocComponent, {
      width: '400px',
      data: { documento }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.documentoService.eliminarDocumento(documento.idDocumento, this.username).subscribe(
          (response) => {
            if (response && response.message) {
              alert(response.message);
              this.dataSource.data = this.dataSource.data.filter(d => d.idDocumento !== documento.idDocumento);
            } else {
              alert('Error desconocido al eliminar el documento');
            }
          },
          (error) => {
            console.error('Error al eliminar el documento:', error);
            if (error.error && error.error.error) {
              alert(error.error.error);
            } else {
              alert('Hubo un error al intentar eliminar el documento');
            }
          }
        );
      }
    });
  }
}