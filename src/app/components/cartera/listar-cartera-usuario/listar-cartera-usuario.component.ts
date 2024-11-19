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
import { LoginService } from '../../../services/login.service';

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
  documentos: DocumentoByCartera[] = [];
  displayedColumns: string[] = [
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

  constructor(
    private carteraService: CarteraService,
    private documentoService: DocumentoService,
    private dialog: MatDialog,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const username = this.loginService.getUsername();

    if (username) {
      this.carteraService.getCarteraSummaryByUsername(username).subscribe(
        (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error) => {
          console.error('Error fetching cartera summary by username:', error);
        }
      );
    } else {
      console.error('Username is not available');
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSelectCartera(row: CarteraResumenUsuario): void {
    this.selectedCartera = row;
  }

  isButtonSelected(): boolean {
    return this.selectedCartera !== null;
  }

  verDocumentosPorCartera(idCartera: number): void {
    this.documentoService.listByCarteraId(idCartera).subscribe(
      (documentos: DocumentoByCartera[]) => {
        this.dialog.open(ListarDocumentoUsuarioComponent, {
          data: documentos,
          width: '1500px'
        });
      },
      (error) => {
        console.error('Error fetching documents by cartera ID:', error);
      }
    );
  }

  exportToPDF(): void {
    if (!this.selectedCartera) {
      console.error('No Cartera selected');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    let currentY = 20;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Cartera', 105, currentY, { align: 'center' });
    currentY += 10;

    doc.setLineWidth(0.5);
    doc.line(15, currentY, 195, currentY);
    currentY += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);

    const details = [
      { label: 'ID Cartera:', value: this.selectedCartera.idCartera },
      { label: 'Nombre:', value: this.selectedCartera.nombreCartera },
      { label: 'Empresa:', value: this.selectedCartera.nombreEmpresa },
      { label: 'TCEA:', value: `${this.selectedCartera.tcea || 0}%` },
      { label: 'Moneda:', value: this.selectedCartera.moneda },
      { label: 'Cantidad de Documentos:', value: this.selectedCartera.cantidadDocumentos },
      { label: 'Monto Total de la Cartera:', value: this.selectedCartera.montoTotalCartera?.toFixed(2) || '0.00' }
    ];

    details.forEach((detail, index) => {
      doc.text(detail.label, 20, currentY + index * 7);
      doc.text(`${detail.value}`, 70, currentY + index * 7);
    });

    currentY += 50;
    doc.setLineWidth(0.5);
    doc.line(15, currentY, 195, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Documentos Asociados', 105, currentY, { align: 'center' });
    currentY += 10;

    if (this.selectedCartera.idCartera != null) {
      this.documentoService.listByCarteraId(this.selectedCartera.idCartera).subscribe(
        (documentos: DocumentoByCartera[]) => {
          this.documentos = documentos;
          const documentosTableData = this.documentos.map(doc => [
            doc.idDocumento,
            doc.fechaEmision ? new Date(doc.fechaEmision).toLocaleDateString() : '',
            doc.fechaVencimiento ? new Date(doc.fechaVencimiento).toLocaleDateString() : '',
            doc.valorDocumento ? doc.valorDocumento.toFixed(2) : '0.00',
            doc.clienteNombre || '',
            doc.estado || ''
          ]);

          autoTable(doc, {
            head: [['ID Documento', 'Fecha Emisión', 'Fecha Vencimiento', 'Valor', 'Cliente', 'Estado']],
            body: documentosTableData,
            startY: currentY,
            theme: 'striped',
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { left: 15, right: 15 },
          });

          const montoTotal = this.documentos.reduce((total, doc) => total + (doc.valorDocumento || 0), 0);
          const finalY = (doc as any).autoTable.previous.finalY || currentY;
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text(`Monto Total de Documentos: ${montoTotal.toFixed(2)}`, 15, finalY + 10);

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