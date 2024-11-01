import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarBancoComponent } from './listar-banco/listar-banco.component';

@Component({
  selector: 'app-banco',
  standalone: true,
  imports: [RouterOutlet, ListarBancoComponent],
  templateUrl: './banco.component.html',
  styleUrl: './banco.component.css'
})
export class BancoComponent {
  constructor(public route:ActivatedRoute) { }
  ngOnInit(): void {
  }

}
