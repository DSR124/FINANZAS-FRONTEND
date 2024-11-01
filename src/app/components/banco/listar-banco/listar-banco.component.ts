import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Banco } from '../../../models/banco';
import { BancoService } from '../../../services/banco.service';
@Component({
  selector: 'app-listar-banco',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule, 
    MatDialogModule, 
    MatInputModule, 
    RouterModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatSortModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './listar-banco.component.html',
  styleUrl: './listar-banco.component.css'
})
export class ListarBancoComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'imageUrl', 'balance', 'tasaNomninal', 'tasaEfectiva', 'cosionExtra', 'creationDate'];
  dataSource: MatTableDataSource<Banco> = new MatTableDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bancoService: BancoService,
    public route: ActivatedRoute,
    private _matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBancos();
  }

  loadBancos() {
    this.bancoService.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.bancoService.getList().subscribe((data) => {
      this.dataSource.data = data;
    });
  }
  filter(en: any) {
    this.dataSource.filter = en.target.value.trim();
  }

}
