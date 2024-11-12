import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Usuario } from '../models/usuario';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url = `${base_url}/Usuario`;

  private listaCambio = new Subject<Usuario[]>();

  constructor(private http: HttpClient) {}

  // Obtener la lista de usuarios
  list(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/Listar`).pipe(
      tap(data => this.setList(data))
    );
  }

  // Insertar un nuevo usuario
  insert(i: Usuario): Observable<any> {
    return this.http.post(`${this.url}/Registrar`, i).pipe(
      tap(() => this.list().subscribe())
    );
  }

  // Eliminar un usuario por ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/Eliminar/${id}`).pipe(
      tap(() => this.list().subscribe())
    );
  }

  // Obtener usuario por ID
  listId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/ListarporID/${id}`);
  }

  // Actualizar usuario
  update(rt: Usuario): Observable<any> {
    return this.http.put(`${this.url}/Modificar`, rt).pipe(
      tap(() => this.list().subscribe())
    );
  }

  // Encontrar el último usuario registrado
  encontrarUltimoUsuario(): Observable<number> {
    return this.http.get<number>(`${this.url}/ultimoUsuario`);
  }
 // Nuevo método: Buscar usuario por username
 buscarPorUsername(username: string): Observable<Usuario> {
  return this.http.get<Usuario>(`${this.url}/buscarPorUsername/${username}`);
}
  // Gestionar el estado de la lista de usuarios localmente
  private setList(listaNueva: Usuario[]): void {
    this.listaCambio.next(this.sortList(listaNueva));
  }

  getList(): Observable<Usuario[]> {
    return this.listaCambio.asObservable();
  }

  private sortList(list: Usuario[]): Usuario[] {
    return list.sort((a, b) => a.idUsuario - b.idUsuario);
  }
}
