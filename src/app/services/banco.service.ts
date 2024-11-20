import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Banco } from '../models/banco';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class BancoService {
  private url = `${base_url}/Banco`;
  private listaCambio = new Subject<Banco[]>();

  constructor(private http: HttpClient) {}

  // Listar todos los bancos
  list(): Observable<Banco[]> {
    return this.http.get<Banco[]>(`${this.url}/Listar`).pipe(
      tap((data) => this.setList(data)),
      catchError(this.handleError('fetching banks list'))
    );
  }

  // Insertar un nuevo banco
  insert(banco: Banco): Observable<any> {
    return this.http.post(`${this.url}/Registrar`, banco).pipe(
      tap(() => this.refreshList()),
      catchError(this.handleError('registering bank'))
    );
  }

  // Eliminar un banco por ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/Eliminar/${id}`).pipe(
      tap(() => this.refreshList()),
      catchError(this.handleError('deleting bank'))
    );
  }

  // Obtener un banco por ID
  listId(id: number): Observable<Banco> {
    return this.http.get<Banco>(`${this.url}/ListarporID/${id}`).pipe(
      catchError(this.handleError('fetching bank by ID'))
    );
  }

  // Actualizar un banco existente
  update(banco: Banco): Observable<any> {
    return this.http.put(`${this.url}/Modificar/${banco.idBanco}`, banco).pipe(
      tap(() => this.refreshList()),
      catchError(this.handleError('updating bank'))
    );
  }

  // Refrescar la lista de bancos
  private refreshList() {
    this.list().subscribe((data) => this.setList(data));
  }

  // Configurar la lista de bancos y notificar a los suscriptores
  setList(listaNueva: Banco[]): void {
    this.listaCambio.next(this.sortList(listaNueva));
  }

  // Obtener la lista de bancos como observable
  getList(): Observable<Banco[]> {
    return this.listaCambio.asObservable();
  }

  // Ordenar la lista de bancos por ID
  private sortList(list: Banco[]): Banco[] {
    return list.sort((a, b) => a.idBanco - b.idBanco);
  }



  // Manejador de errores para las operaciones HTTP
  private handleError(operation: string) {
    return (error: any): Observable<never> => {
      console.error(`Error ${operation}:`, error);
      return throwError(() => new Error(`Error ${operation}: ${error.message || 'Unknown error'}`));
    };
  }
}
