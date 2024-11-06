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

  // Método para iniciar sesión y almacenar el token en sessionStorage
  login(request: JwtRequest) {
    return this.http.post('http://localhost:8080/login', request);
  }

  // Método para verificar si el usuario está autenticado
  verificar() {
    let token = sessionStorage.getItem('token');
    return token != null;
  }

  // Método para obtener el rol del usuario desde el token en sessionStorage
  showRole() {
    let token = sessionStorage.getItem('token');
    if (!token) {
      return null;
    }
    const decodedToken = this.helper.decodeToken(token);
    return decodedToken?.role;
  }

  // Método para guardar el token en sessionStorage después del inicio de sesión
  setToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  // Método para obtener el token desde sessionStorage
  getToken() {
    return sessionStorage.getItem('token');
  }

  // Método para eliminar el token de sessionStorage (ej. en logout)
  removeToken() {
    sessionStorage.removeItem('token');
  }

  // Método para obtener el nombre de usuario del token JWT
  getUsername() {
    let token = sessionStorage.getItem('token');
    if (!token) {
      return null;
    }
    const decodedToken = this.helper.decodeToken(token);
    return decodedToken?.username; // Reemplaza 'username' por el nombre exacto del campo en tu token JWT
  }
}
