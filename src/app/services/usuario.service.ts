import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { environment } from '../../environments/environment';
import { Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base; // ruta de la base de datos

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url = `${base_url}/usuarios`;
  private listaCambio = new Subject<Usuario[]>()

  
  private sortList(list: Usuario[]): Usuario[] {
    return list.sort((a, b) => a.idUsuario - b.idUsuario);
  }

  constructor(private http: HttpClient) { }
  list() {
    return this.http.get<Usuario[]>(`${this.url}/Listar`).pipe(
      tap(data => this.setList(data)));
  }
  insert(dt: Usuario) {
    return this.http.post(`${this.url}/Registrar`, dt).pipe(
      tap(() => this.list().subscribe()));
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/Eliminar/${id}`);
  }
  listId(id: number) {
    return this.http.get<Usuario>(`${this.url}/ListarporID/${id}`);
  }
  update(usuario:Usuario) { 
    return this.http.put(`${this.url}/Modificar/${usuario.idUsuario}`, usuario);
  }

  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(this.sortList(listaNueva));
  }

  getList() {
    return this.listaCambio.asObservable();
  }
  
}
