import { Component, OnInit } from '@angular/core';
import { BancoService } from '../../../services/banco.service';
import { Banco } from '../../../models/banco';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-banco-usuario',
  standalone: true,
  imports: [CommonModule,MatCardModule],
  templateUrl: './listar-banco-usuario.component.html',
  styleUrl: './listar-banco-usuario.component.css'
})
export class ListarBancoUsuarioComponent implements OnInit{
  dataSource: MatTableDataSource<Banco> = new MatTableDataSource();
  role: string = '';
  coloresDeFondo: string[] = [];

  displayedColumns: string[] = [
    'codigo',
    'nombre',
    'balance',
    'tasaNominal',
    'tasaEfectiva',
    'acciones',
  ];

  constructor(
    private vS: BancoService,
    public route: ActivatedRoute,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.vS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.vS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  filter(en: any) {
    this.dataSource.filter = en.target.value.trim();
  }

  imagenNoCargada(event: any) {
    console.error('Error al cargar la imagen:', event);
  }

  getImagenUrl(banco: Banco): string {
    if (banco.imageUrl) {
      return 'data:image/jpeg;base64,' + banco.imageUrl;
    } else {
      return 'assets/image/EstacionamientoDefault.jpg';
    }
  }
}


