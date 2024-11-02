// cartera.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Cartera } from '../models/cartera';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class CarteraService {
  private url = `${base_url}/Cartera`;
  private listaCambio = new Subject<Cartera[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<Cartera[]> {
    return this.http.get<Cartera[]>(`${this.url}/Listar`).pipe(
      tap(data => this.setList(data)),
      catchError(error => {
        console.error('Error fetching cartera list:', error);
        throw error;
      })
    );
  }

  insert(dt: Cartera): Observable<any> {
    return this.http.post(`${this.url}/Registrar`, dt).pipe(
      tap(() => this.refreshList()),
      catchError(error => {
        console.error('Error registering cartera:', error);
        throw error;
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/Eliminar/${id}`).pipe(
      tap(() => this.refreshList()),
      catchError(error => {
        console.error('Error deleting cartera:', error);
        throw error;
      })
    );
  }

  listId(id: number): Observable<Cartera> {
    return this.http.get<Cartera>(`${this.url}/ListarporID/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching cartera by ID:', error);
        throw error;
      })
    );
  }

  update(cartera: Cartera): Observable<any> {
    return this.http.put(`${this.url}/Modificar/${cartera.idCartera}`, cartera).pipe(
      tap(() => this.refreshList()),
      catchError(error => {
        console.error('Error updating cartera:', error);
        throw error;
      })
    );
  }

  private refreshList() {
    this.list().subscribe((data) => this.setList(data));
  }

  setList(listaNueva: Cartera[]): void {
    this.listaCambio.next(listaNueva);
  }

  getList(): Observable<Cartera[]> {
    return this.listaCambio.asObservable();
  }
}
