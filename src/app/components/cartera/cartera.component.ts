import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarCarteraComponent } from './listar-cartera/listar-cartera.component';

@Component({
  selector: 'app-cartera',
  standalone: true,
  imports: [RouterOutlet  , ListarCarteraComponent],

  templateUrl: './cartera.component.html',
  styleUrl: './cartera.component.css'
})
export class CarteraComponent {
  constructor(public route:ActivatedRoute) { }
  ngOnInit(): void {
  }

}
