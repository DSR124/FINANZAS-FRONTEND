import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CarteraService } from '../../../services/cartera.service';
import { Cartera } from '../../../models/cartera';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { CarteraResumenUsuario } from '../../../models/carteraResumenUsuario';
import { DocumentoService } from '../../../services/documento.service';
import { DocumentoByCartera } from '../../../models/DocumentobyCartera';
import { MatDialog } from '@angular/material/dialog';
import { ListarDocumentoUsuarioComponent } from '../../documento/listar-documento-usuario/listar-documento-usuario.component';

@Component({
  selector: 'app-listar-cartera-usuario',
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
  templateUrl: './listar-cartera-usuario.component.html',
  styleUrl: './listar-cartera-usuario.component.css'
})
export class ListarCarteraUsuarioComponent  implements OnInit{
  displayedColumns: string[] = [
    'idCartera',
    'nombreCartera',
    'fechaCreacion',
    'fechaDescuento',
    'nombreEmpresa',
    'tcea',
    'moneda',
    'cantidadDocumentos',
    'montoTotalCartera',
    'verDocumentos' 
  ];
  dataSource = new MatTableDataSource<CarteraResumenUsuario>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private carteraService: CarteraService , private documentoService: DocumentoService , private dialog: MatDialog) {}

  ngOnInit(): void {
    this.carteraService.getCarteraSummary().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  verDocumentosPorCartera(idCartera: number): void {
    this.documentoService.listByCarteraId(idCartera).subscribe((documentos: DocumentoByCartera[]) => {
      this.dialog.open(ListarDocumentoUsuarioComponent, {
        data: documentos,
        width: '1500px'
      });
    }, error => {
      console.error('Error fetching documents by cartera ID:', error);
    });
  }

  exportToPDF() {
    const doc = new jsPDF();

    // Configura el encabezado del documento
    doc.text('Listado de Carteras', 14, 10);

    // Genera los datos para la tabla en PDF
    const tableData = this.dataSource.data.map((cartera) => [
      cartera.idCartera,
      cartera.nombreCartera,
      cartera.fechaDescuento ? new Date(cartera.fechaDescuento).toLocaleDateString() : '',
      cartera.tcea ? cartera.tcea.toFixed(2) : 'N/A',
      cartera.fechaCreacion ? new Date(cartera.fechaCreacion).toLocaleDateString() : '',
      cartera.nombreEmpresa,
      cartera.moneda === 'PEN' ? 'Soles' : 'Dólares'
    ]);

    // Utiliza `autoTable` para crear la tabla en el PDF
    autoTable(doc, {
      head: [['ID Cartera', 'Nombre', 'Fecha de Descuento', 'TCEA (%)', 'Fecha de Creación', 'Empresa', 'Moneda']],
      body: tableData,
      startY: 20, // Margen desde el borde superior
    });

    // Descarga el archivo PDF
    doc.save('Listado_de_Carteras.pdf');
  }
  exportToExcel(): void {
    // Mapea los datos para ser exportados a Excel
    const tableData = this.dataSource.data.map((cartera) => ({
      'ID Cartera': cartera.idCartera,
      'Nombre': cartera.nombreCartera,
      'Fecha de Descuento': cartera.fechaDescuento ? new Date(cartera.fechaDescuento).toLocaleDateString() : '',
      'TCEA (%)': cartera.tcea ? cartera.tcea.toFixed(2) : 'N/A',
      'Fecha de Creación': cartera.fechaCreacion ? new Date(cartera.fechaCreacion).toLocaleDateString() : '',
      'Empresa': cartera.nombreEmpresa,
      'Moneda': cartera.moneda === 'PEN' ? 'Soles' : 'Dólares'
    }));

    // Crea un workbook y una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Carteras');

    // Descarga el archivo Excel
    XLSX.writeFile(workbook, 'Listado_de_Carteras.xlsx');
  }
 
}
