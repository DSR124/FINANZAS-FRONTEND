import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = `${base_url}/auth`; // Ajusta esta URL a la de tu backend

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión
  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.url}/login`, { username, password }, { headers }).pipe(
      tap((response: any) => {
        sessionStorage.setItem('token', response.token); // Almacena el token en sessionStorage
      }),
      catchError((error) => {
        console.error('Error during login:', error);
        return of(null);
      })
    );
  }

  // Método para cerrar sesión
  logout(): void {
    sessionStorage.removeItem('token');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  // Obtener el token del usuario autenticado
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
}
