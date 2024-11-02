import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Rol } from '../models/rol';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private url = `${base_url}/Rol`;
  private listaCambio = new Subject<Rol[]>();

  constructor(private http: HttpClient) {}

  // List all roles
  list(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.url}/Listar`).pipe(
      tap(data => this.setList(data))
    );
  }

  // Insert a new role
  insert(rol: Rol): Observable<any> {
    return this.http.post(`${this.url}/Registrar`, rol).pipe(
      tap(() => this.refreshList())
    );
  }

  // Delete a role by ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/Eliminar/${id}`).pipe(
      tap(() => this.refreshList())
    );
  }

  // Get a role by ID
  listId(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/ListarporID/${id}`);
  }

  // Update an existing role
  update(rol: Rol): Observable<any> {
    return this.http.put(`${this.url}/Modificar`, rol).pipe(
      tap(() => this.refreshList())
    );
  }

  // Update the list of roles and notify observers
  setList(listaNueva: Rol[]): void {
    this.listaCambio.next(listaNueva);
  }

  // Get the observable list of roles
  getList(): Observable<Rol[]> {
    return this.listaCambio.asObservable();
  }

  // Refresh the role list after an operation
  private refreshList(): void {
    this.list().subscribe();
  }
}
