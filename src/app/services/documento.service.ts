import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Documento } from '../models/documento';
import { Observable, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DocumentoByCartera } from '../models/DocumentobyCartera';

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

  // Modify document status
  modifyStatus(documento: Documento): Observable<any> {
    return this.http.put(`${this.url}/ModificarEstado`, documento).pipe(
      catchError(error => {
        console.error('Error modifying document status:', error);
        throw error;
      })
    );
  }

  // Obtener documentos por ID de cartera (incluyendo TEP)
  listByCarteraId(idCartera: number): Observable<DocumentoByCartera[]> {
    return this.http
      .get<DocumentoByCartera[]>(`${this.url}/ListarporIDCartera/${idCartera}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching documents by cartera ID:', error);
          throw error;
        })
      );
  }

  // Obtener documentos por nombre de usuario
  listByUsername(username: string): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${this.url}/ListarPorUsuario/${username}`).pipe(
      catchError(error => {
        console.error('Error al obtener documentos por nombre de usuario:', error);
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

  eliminarDocumento(id: number, username: string): Observable<any> {
    const url = `${this.url}/Eliminar2/${id}?username=${encodeURIComponent(username)}`;
    return this.http.delete<any>(url).pipe(
      catchError(error => {
        console.error('Error al eliminar el documento:', error);
        throw error;
      })
    );
  }
}
