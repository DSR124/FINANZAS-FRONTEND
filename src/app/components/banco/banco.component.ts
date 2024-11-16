import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarBancoUsuarioComponent } from "./listar-banco-usuario/listar-banco-usuario.component";

@Component({
  selector: 'app-banco',
  standalone: true,
  imports: [RouterOutlet,ListarBancoUsuarioComponent],
  templateUrl: './banco.component.html',
  styleUrl: './banco.component.css'
})
export class BancoComponent {
  constructor(public route:ActivatedRoute) { }
  ngOnInit(): void {
  }

}
