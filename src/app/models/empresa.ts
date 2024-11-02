import { Usuario } from "./usuario";

export class Empresa{
    idEmpresa: number = 0;
    nombre: string = '';
    tipo: string = '';
    ruc: number = 0;
    direccion: string = '';
    usuario: Usuario = new Usuario();
}