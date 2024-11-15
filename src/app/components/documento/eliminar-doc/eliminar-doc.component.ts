import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Empresa } from '../../../models/empresa';
import { Cartera } from '../../../models/cartera';
import { Documento } from '../../../models/documento';
import { EmpresaService } from '../../../services/empresa.service';
import { CarteraService } from '../../../services/cartera.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { DocumentoService } from '../../../services/documento.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-eliminar-doc',
  standalone: true,
  imports: [    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatSelectModule,
    MatDatepickerModule],
  templateUrl: './eliminar-doc.component.html',
  styleUrl: './eliminar-doc.component.css'
})
export class EliminarDocComponent {
  eliminarForm: FormGroup;
  documento: Documento;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EliminarDocComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { documento: Documento }
  ) {
    this.documento = data.documento; // Receive the document data
    this.eliminarForm = this.fb.group({
      username: ['', Validators.required] // Collect the username
    });
  }

  // Method called when the "Eliminar" button is clicked
  onEliminar(): void {
    if (this.eliminarForm.valid) {
      const username = this.eliminarForm.get('username')?.value;
      this.dialogRef.close(username); // Pass the username back to the parent component
    }
  }

  // Method called when the "Cancelar" button is clicked
  onCancel(): void {
    this.dialogRef.close(null); // Close the dialog without confirming
  }
}