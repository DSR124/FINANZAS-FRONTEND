import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Empresa } from '../models/empresa';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const base_url = environment.base; // base database URL

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private url = `${base_url}/Empresa`;
  private listaCambio = new Subject<Empresa[]>();

  constructor(private http: HttpClient) { }

  // List all companies
  list(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.url}/Listar`).pipe(
      tap(data => this.setList(data)),
      catchError(error => {
        console.error('Error fetching companies list:', error);
        throw error;
      })
    );
  }

  // Insert a new company
  insert(dt: Empresa): Observable<any> {
    return this.http.post(`${this.url}/Registrar`, dt).pipe(
      tap(() => this.list().subscribe()),
      catchError(error => {
        console.error('Error registering company:', error);
        throw error;
      })
    );
  }

  // Delete a company by ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/Eliminar/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting company:', error);
        throw error;
      })
    );
  }

  // Get a company by ID
  listId(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.url}/ListarporID/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching company by ID:', error);
        throw error;
      })
    );
  }

  // Update a company
  update(empresa: Empresa): Observable<any> { 
    return this.http.put(`${this.url}/Modificar/${empresa.idEmpresa}`, empresa).pipe(
      catchError(error => {
        console.error('Error updating company:', error);
        throw error;
      })
    );
  }

  // Set the list of companies and notify subscribers
  setList(listaNueva: Empresa[]): void {
    this.listaCambio.next(this.sortList(listaNueva));
  }

  // Get the observable list of companies
  getList(): Observable<Empresa[]> {
    return this.listaCambio.asObservable();
  }

  // Sort the list of companies by ID
  private sortList(list: Empresa[]): Empresa[] {
    return list.sort((a, b) => a.idEmpresa - b.idEmpresa);
  }
}
