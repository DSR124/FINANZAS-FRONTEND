import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { JwtRequest } from '../models/jwtRequest';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) {}
  login(request: JwtRequest) {
    return this.http.post('http://localhost:8080/login', request);
  }
  verificar() {
    let token = sessionStorage.getItem('token');
    return token != null;
  }
  showRole() {
    // Verifica si `window` y `sessionStorage` están disponibles
    if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
      console.warn('sessionStorage no está disponible en este entorno.');
      return null; // Retorna un valor predeterminado o maneja el caso cuando no está disponible
    }
  
    const token = sessionStorage.getItem('token');
    if (!token) {
      // Manejar el caso en el que el token es nulo
      return null;
    }
  
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.role;
  }
  
}
