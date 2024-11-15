// cartera.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Cartera } from '../models/cartera';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CarteraResumenUsuario } from '../models/carteraResumenUsuario';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class CarteraService {
  private url = `${base_url}/Cartera`;
  private listaCambio = new Subject<Cartera[]>();

  constructor(private http: HttpClient) {}

  // Listar todas las carteras
  list(): Observable<Cartera[]> {
    return this.http.get<Cartera[]>(`${this.url}/Listar`).pipe(
      tap(data => this.setList(data)),
      catchError(error => {
        console.error('Error fetching cartera list:', error);
        throw error;
      })
    );
  }

  // Insertar una nueva cartera
  insert(dt: Cartera): Observable<any> {
    return this.http.post(`${this.url}/Registrar`, dt).pipe(
      tap(() => this.refreshList()),
      catchError(error => {
        console.error('Error registering cartera:', error);
        throw error;
      })
    );
  }

  // Eliminar una cartera por ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/Eliminar/${id}`).pipe(
      tap(() => this.refreshList()),
      catchError(error => {
        console.error('Error deleting cartera:', error);
        throw error;
      })
    );
  }

  // Obtener una cartera por ID
  listId(id: number): Observable<Cartera> {
    return this.http.get<Cartera>(`${this.url}/ListarporID/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching cartera by ID:', error);
        throw error;
      })
    );
  }

  // Actualizar una cartera
  update(cartera: Cartera): Observable<any> {
    return this.http.put(`${this.url}/Modificar/${cartera.idCartera}`, cartera).pipe(
      tap(() => this.refreshList()),
      catchError(error => {
        console.error('Error updating cartera:', error);
        throw error;
      })
    );
  }

  // Obtener el resumen de la cartera
  getCarteraSummary(): Observable<CarteraResumenUsuario[]> {
    return this.http.get<CarteraResumenUsuario[]>(`${this.url}/findAllCarteraWithDocumentCountAndTotalValue`).pipe(
      catchError(error => {
        console.error('Error fetching cartera summary:', error);
        throw error;
      })
    );
  }

  // Nuevo método para obtener el resumen de la cartera por username
  getCarteraSummaryByUsername(username: string): Observable<CarteraResumenUsuario[]> {
    return this.http.get<CarteraResumenUsuario[]>(`${this.url}/findAllCarteraWithDocumentCountAndTotalValueByUsername/${username}`).pipe(
      catchError(error => {
        console.error('Error fetching cartera summary by username:', error);
        throw error;
      })
    );
  }

  // Refrescar la lista de carteras
  private refreshList() {
    this.list().subscribe((data) => this.setList(data));
  }

  // Configurar la nueva lista de carteras
  setList(listaNueva: Cartera[]): void {
    this.listaCambio.next(listaNueva);
  }

  // Obtener la lista observable de carteras
  getList(): Observable<Cartera[]> {
    return this.listaCambio.asObservable();
  }

  // En CarteraService
listByEmpresaId(empresaId: number): Observable<Cartera[]> {
  return this.http.get<Cartera[]>(`${this.url}/ListarPorEmpresa/${empresaId}`).pipe(
    catchError(error => {
      console.error('Error al obtener carteras por empresa:', error);
      throw error;
    })
  );
}
}
