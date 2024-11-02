import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Contrato } from '../models/contrato';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private url = `${base_url}/Contrato`;
  private listaCambio = new Subject<Contrato[]>();

  constructor(private http: HttpClient) {}

  // List all contracts
  list(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.url}/Listar`).pipe(
      tap(data => this.setList(data)),
      catchError(this.handleError('fetching contracts list'))
    );
  }

  // Insert a new contract
  insert(contrato: Contrato): Observable<any> {
    return this.http.post(`${this.url}/Registrar`, contrato).pipe(
      tap(() => this.refreshList()),
      catchError(this.handleError('registering contract'))
    );
  }

  // Delete a contract by ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/Eliminar/${id}`).pipe(
      tap(() => this.refreshList()),
      catchError(this.handleError('deleting contract'))
    );
  }

  // Get a contract by ID
  listId(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.url}/ListarporID/${id}`).pipe(
      catchError(this.handleError('fetching contract by ID'))
    );
  }

  // Update a contract
  update(contrato: Contrato): Observable<any> {
    return this.http.put(`${this.url}/Modificar/${contrato.id}`, contrato).pipe(
      tap(() => this.refreshList()),
      catchError(this.handleError('updating contract'))
    );
  }

  // Refresh the list of contracts
  private refreshList() {
    this.list().subscribe(data => this.setList(data));
  }

  // Set the list of contracts and notify subscribers
  setList(listaNueva: Contrato[]): void {
    this.listaCambio.next(listaNueva);
  }

  // Get the observable list of contracts
  getList(): Observable<Contrato[]> {
    return this.listaCambio.asObservable();
  }

  // Error handling helper function
  private handleError(operation: string) {
    return (error: any): Observable<never> => {
      console.error(`Error ${operation}:`, error);
      return throwError(() => new Error(`Error ${operation}: ${error.message || 'Unknown error'}`));
    };
  }
}
