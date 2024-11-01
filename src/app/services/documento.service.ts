import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Documento } from '../models/documento';
import { Observable, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private url = `${base_url}/Documento`;
  private listaCambio = new Subject<Documento[]>();

  constructor(private http: HttpClient) {}

  // List all documents
  list(): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${this.url}/Listar`).pipe(
      tap(data => this.setList(data)),
      catchError(error => {
        console.error('Error fetching documents list:', error);
        throw error;
      })
    );
  }

  // Insert a new document
  insert(documento: Documento): Observable<any> {
    return this.http.post(`${this.url}/Registrar`, documento).pipe(
      tap(() => this.refreshList()),
      catchError(error => {
        console.error('Error registering document:', error);
        throw error;
      })
    );
  }

  // Delete a document by ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/Eliminar/${id}`).pipe(
      tap(() => this.refreshList()),
      catchError(error => {
        console.error('Error deleting document:', error);
        throw error;
      })
    );
  }

  // Get a document by ID
  listId(id: number): Observable<Documento> {
    return this.http.get<Documento>(`${this.url}/ListarporID/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching document by ID:', error);
        throw error;
      })
    );
  }

  // Update a document
  update(documento: Documento): Observable<any> {
    return this.http.put(`${this.url}/Modificar/${documento.idDocumento}`, documento).pipe(
      tap(() => this.refreshList()),
      catchError(error => {
        console.error('Error updating document:', error);
        throw error;
      })
    );
  }

  // Refresh the list of documents
  private refreshList() {
    this.list().subscribe((data) => this.setList(data));
  }

  // Set the list of documents and notify subscribers
  setList(listaNueva: Documento[]): void {
    this.listaCambio.next(listaNueva);
  }

  // Get the observable list of documents
  getList(): Observable<Documento[]> {
    return this.listaCambio.asObservable();
  }
}
