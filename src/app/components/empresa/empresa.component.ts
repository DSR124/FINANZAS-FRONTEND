import { Component } from '@angular/core';
import { ListaEmpresaComponent } from './lista-empresa/lista-empresa.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [RouterOutlet, ListaEmpresaComponent],

  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css'
})
export class EmpresaComponent {
  constructor(public route:ActivatedRoute) { }
  ngOnInit(): void {
  }

}
