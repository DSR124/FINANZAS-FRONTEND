import { Component, OnInit, ViewChild } from '@angular/core';
// import { CategoryService } from '../../../services/category.service';
// import { Category } from '../../../models/category';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {MatDialog,MatDialogModule } from '@angular/material/dialog';
import { Empresa } from '../../../models/empresa';
import { EmpresaComponent } from '../empresa.component';
import { EmpresaService } from '../../../services/empresa.service';
import { LoginService } from '../../../services/login.service';
@Component({
  selector: 'app-lista-empresa',
  standalone: true,
  imports: [MatFormFieldModule, MatDialogModule, MatInputModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule],
  templateUrl: './lista-empresa.component.html',
  styleUrl: './lista-empresa.component.css'
})
export class ListaEmpresaComponent implements OnInit{
  displayedColumns: string[] = ['id','usuario','nombre', 'direccion','ruc','tipo'];
  dataSource: MatTableDataSource<Empresa> = new MatTableDataSource();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private emp: EmpresaService,
    public route: ActivatedRoute,
    private _matDialog: MatDialog,
    public loginService: LoginService,
  ) {}
  ngOnInit(): void {
    this.emp.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

    });
    this.emp.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

    });

  }
  filter(en: any) {
    this.dataSource.filter = en.target.value.trim();
  }
}
