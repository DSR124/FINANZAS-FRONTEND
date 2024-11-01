import { Component } from '@angular/core';
import { ListarDocumentoComponent } from './listar-documento/listar-documento.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-documento',
  standalone: true,
  imports: [RouterOutlet  , ListarDocumentoComponent],

  templateUrl: './documento.component.html',
  styleUrl: './documento.component.css'
})
export class DocumentoComponent {
  constructor(public route:ActivatedRoute) { }
  ngOnInit(): void {



    
  }
}
