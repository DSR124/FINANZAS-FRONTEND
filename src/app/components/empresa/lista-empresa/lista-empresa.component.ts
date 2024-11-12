import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Empresa } from '../../../models/empresa';
import { EmpresaService } from '../../../services/empresa.service';
import { LoginService } from '../../../services/login.service';
import { EmpresasUsuarioComponent } from '../empresas-usuario/empresas-usuario.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lista-empresa',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatDialogModule , MatCardModule, MatInputModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule],
  templateUrl: './lista-empresa.component.html',
  styleUrls: ['./lista-empresa.component.css']
})
export class ListaEmpresaComponent implements OnInit {
  dataSource: Empresa[] = [];
  filteredDataSource: Empresa[] = [];
  filterValue: string = '';
  username: string | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Array de nombres de archivos de imágenes
  avatars = [
    'avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png',
    'avatar6.png'
  ];

  constructor(
    private empService: EmpresaService,
    private _matDialog: MatDialog,
    public loginService: LoginService
  ) {}

  ngOnInit(): void {
    // Obtiene el username desde el LoginService
    this.username = this.loginService.getUsername();

    // Llama a listByUsername() para obtener las empresas del usuario
    this.empService.listByUsername().subscribe(
      (data) => {
        this.dataSource = data;
        this.filteredDataSource = data; // Inicializa filteredDataSource con los datos obtenidos
      },
      (error) => {
        console.error('Error al obtener las empresas por usuario:', error);
      }
    );
  }

<<<<<<< Updated upstream
  // Método para obtener el avatar basado en el índice
  getAvatar(index: number): string {
    return `/assets/${this.avatars[index % this.avatars.length]}`;
  }

=======
>>>>>>> Stashed changes
  // Filtra la lista de empresas por varios campos
  filter(event: any) {
    this.filterValue = event.target.value.trim().toLowerCase();
    this.filteredDataSource = this.dataSource.filter((empresa) =>
      empresa.nombre.toLowerCase().includes(this.filterValue) ||
      empresa.usuario.nombre.toLowerCase().includes(this.filterValue) ||
      empresa.direccion.toLowerCase().includes(this.filterValue) ||
      empresa.ruc.toString().includes(this.filterValue) ||
      empresa.tipo.toLowerCase().includes(this.filterValue)
    );
  }

  // Abre el diálogo con la información de la empresa seleccionada
  openDialog(empresaId: number): void {
    this.empService.listId(empresaId).subscribe((empresa) => {
      this._matDialog.open(EmpresasUsuarioComponent, {
        width: '400px',
        data: empresa,
      });
    });
  }

  // Redirige al componente de registro de empresas (si implementado)
  navigateToRegister(): void {
    // Implementar la lógica de navegación a registro
  }
}
