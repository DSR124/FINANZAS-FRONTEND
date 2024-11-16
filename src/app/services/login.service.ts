import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtRequest } from '../models/jwtRequest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private helper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión y almacenar el token en localStorage
  login(request: JwtRequest) {
    return this.http.post('http://localhost:8080/login', request);
  }

  // Método para verificar si el usuario está autenticado
  verificar() {
    let token = localStorage.getItem('token');
    return token != null;
  }

  // Método para obtener el rol del usuario desde el token
  showRole() {
    let token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const decodedToken = this.helper.decodeToken(token);
    return decodedToken?.role; // Asegúrate de que 'role' sea el nombre correcto
  }

  // Método para obtener el nombre de usuario del token
  getUsername(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const payload = this.helper.decodeToken(token);
      return payload.sub || null; // Asegúrate de que 'sub' sea el campo correcto
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  // Método para guardar el token en localStorage
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Método para obtener el token desde localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Método para eliminar el token de localStorage
  removeToken() {
    localStorage.removeItem('token');
  }
}
