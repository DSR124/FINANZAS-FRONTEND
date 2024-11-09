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
  selectedCartera: CarteraResumenUsuario | null = null;
  selectedCarteraDetails: CarteraResumenUsuario | null = null;
  documentos: DocumentoByCartera[] = [];

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
  selectCartera(cartera: CarteraResumenUsuario) {
    this.selectedCartera = cartera;
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
    if (!this.selectedCartera) {
      console.error('No Cartera selected');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    let currentY = 20;

    // Set up header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Cartera', 105, currentY, { align: 'center' });
    currentY += 10;

    // Add a separator line
    doc.setLineWidth(0.5);
    doc.line(15, currentY, 195, currentY);
    currentY += 10;

    // Cartera Details - Styled as a professional report
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80); // Dark gray text

    // Using a two-column layout for details
    doc.text('ID Cartera:', 20, currentY);
    doc.text(`${this.selectedCartera.idCartera}`, 70, currentY);

    doc.text('Nombre:', 20, currentY + 7);
    doc.text(`${this.selectedCartera.nombreCartera}`, 70, currentY + 7);

    doc.text('Empresa:', 20, currentY + 14);
    doc.text(`${this.selectedCartera.nombreEmpresa}`, 70, currentY + 14);

    doc.text('TCEA:', 20, currentY + 21);
    doc.text(`${this.selectedCartera.tcea}%`, 70, currentY + 21);

    doc.text('Moneda:', 20, currentY + 28);
    doc.text(`${this.selectedCartera.moneda}`, 70, currentY + 28);

    doc.text('Cantidad de Documentos:', 20, currentY + 35);
    doc.text(`${this.selectedCartera.cantidadDocumentos}`, 70, currentY + 35);

    doc.text('Monto Total de la Cartera:', 20, currentY + 42);
    doc.text(`${this.selectedCartera.montoTotalCartera?.toFixed(2) || '0.00'}`, 70, currentY + 42);
    currentY += 50;

    // Add another separator line
    doc.setLineWidth(0.5);
    doc.line(15, currentY, 195, currentY);
    currentY += 10;

    // Section Header for Documents
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0); // Black text
    doc.text('Documentos Asociados', 105, currentY, { align: 'center' });
    currentY += 10;

    // Fetch documents for the selected cartera
    if (this.selectedCartera.idCartera != null) {
      this.documentoService.listByCarteraId(this.selectedCartera.idCartera).subscribe(
        (documentos: DocumentoByCartera[]) => {
          this.documentos = documentos;

          // Prepare document data for the table
          const documentosTableData = this.documentos.map(doc => [
            doc.idDocumento,
            new Date(doc.fechaEmision).toLocaleDateString(),
            new Date(doc.fechaVencimiento).toLocaleDateString(),
            doc.valorDocumento.toFixed(2),
            doc.clienteNombre,
            doc.estado
          ]);

          // Add the table to the PDF
          autoTable(doc, {
            head: [['ID Documento', 'Fecha Emisión', 'Fecha Vencimiento', 'Valor', 'Cliente', 'Estado']],
            body: documentosTableData,
            startY: currentY,
            theme: 'striped', // Use a striped theme for a clean look
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 }, // Blue header with white text
            alternateRowStyles: { fillColor: [245, 245, 245] }, // Light gray rows
            margin: { left: 15, right: 15 },
          });

          // Calculate total amount
          const montoTotal = this.documentos.reduce(
            (total, doc) => total + doc.valorDocumento,
            0
          );

          // Add the total amount below the table
          const finalY = (doc as any).autoTable.previous.finalY || currentY;
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0); // Black text
          doc.text(`Monto Total de Documentos: ${montoTotal.toFixed(2)}`, 15, finalY + 10);

          // Save the PDF
          doc.save('Reporte_Cartera.pdf');
        },
        error => {
          console.error('Error al obtener documentos:', error);
        }
      );
    } else {
      console.error('Cartera ID is null or undefined');
    }
  }
}
