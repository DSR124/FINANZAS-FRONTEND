import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtRequest } from '../models/jwtRequest';

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

  // Método para obtener el rol del usuario desde el token en localStorage
  showRole() {
    let token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const decodedToken = this.helper.decodeToken(token);
    return decodedToken?.role;
  }

  // Método para guardar el token en localStorage después del inicio de sesión
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Método para obtener el token desde localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Método para eliminar el token de localStorage (ej. en logout)
  removeToken() {
    localStorage.removeItem('token');
  }
}
