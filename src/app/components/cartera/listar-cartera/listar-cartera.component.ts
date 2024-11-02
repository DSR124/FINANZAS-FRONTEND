import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-listar-cartera',
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
  templateUrl: './listar-cartera.component.html',
  styleUrl: './listar-cartera.component.css'
})
export class ListarCarteraComponent implements OnInit {
  displayedColumns: string[] = ['idCartera', 'nombre', 'fechaDescuento', 'tcea', 'fechaCreacion', 'empresa', 'moneda'];
  dataSource: MatTableDataSource<Cartera> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private carteraService: CarteraService) {}

  ngOnInit(): void {
    this.carteraService.list().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  exportToPDF() {
    const doc = new jsPDF();

    // Configura el encabezado del documento
    doc.text('Listado de Carteras', 14, 10);

    // Genera los datos para la tabla en PDF
    const tableData = this.dataSource.data.map((cartera) => [
      cartera.idCartera,
      cartera.nombre,
      new Date(cartera.fechaDescuento).toLocaleDateString(),
      cartera.tcea,
      new Date(cartera.fechaCreacion).toLocaleDateString(),
      cartera.empresa.nombre,
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
    const element = document.getElementById('excel-table');

    if (!element) {
      console.error('No se encontró el elemento con ID "excel-table".');
      return;
    }

    const worksheet = XLSX.utils.table_to_sheet(element);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Carteras');
    XLSX.writeFile(workbook, 'Listado_de_Carteras.xlsx');
  }
}
