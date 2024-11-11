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
        localStorage.setItem('token', response.token); // Almacena el token en localStorage
      }),
      catchError((error) => {
        console.error('Error during login:', error);
        return of(null);
      })
    );
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtener el token del usuario autenticado
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
