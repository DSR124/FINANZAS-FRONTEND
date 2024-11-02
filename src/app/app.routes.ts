import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { segGuard } from './guard/seguridad.guard';
import { SingInComponent } from './components/sing-in/sing-in.component';
import { LoadingComponent } from './components/loading/loading.component';
import { HomeComponent } from './components/home/home.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { EmpresaComponent } from './components/empresa/empresa.component';
import { CreaeditaEmpresaComponent } from './components/empresa/creaedita-empresa/creaedita-empresa.component';
import { ListaEmpresaComponent } from './components/empresa/lista-empresa/lista-empresa.component';
import { BancoComponent } from './components/banco/banco.component';
import { CreaeditaBancoComponent } from './components/banco/creaedita-banco/creaedita-banco.component';
import { ListarBancoComponent } from './components/banco/listar-banco/listar-banco.component';
import { DocumentoComponent } from './components/documento/documento.component';
import { CreaeditaDocumentoComponent } from './components/documento/creaedita-documento/creaedita-documento.component';
import { ListarDocumentoComponent } from './components/documento/listar-documento/listar-documento.component';
import { CarteraComponent } from './components/cartera/cartera.component';
import { CreaeditaCarteraComponent } from './components/cartera/creaedita-cartera/creaedita-cartera.component';
import { ListarCarteraComponent } from './components/cartera/listar-cartera/listar-cartera.component';
import { ContratoComponent } from './components/contrato/contrato.component';
import { CreaeditaContratoComponent } from './components/contrato/creaedita-contrato/creaedita-contrato.component';
import { ListarContratoComponent } from './components/contrato/listar-contrato/listar-contrato.component';
import { CreaRolComponent } from './components/sing-in/crea-rol/crea-rol.component';
import { EmpresasUsuarioComponent } from './components/empresa/empresas-usuario/empresas-usuario.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },

  {
    path: 'landing',
    component: LoadingComponent,
  },

{
    
    path: 'homes',
    component: HomeComponent,
    canActivate: [segGuard], // solo construcciones, se debe agregar a cada uno
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registrar',
    component: SingInComponent,
  },

  {
    path: 'usuario',
    component: UsuarioComponent,
  },
  {
    path: 'rol',
    component: CreaRolComponent,
  },

  {
    path: 'empresa',
    component: EmpresaComponent,
    children: [
      {
        path: 'registrar_empresa',
        component: CreaeditaEmpresaComponent,
      },
      {
        path: 'listar_empresa',
        component: ListaEmpresaComponent,
      },
      {
        path: 'listar_empresa_usuario',
        component: EmpresasUsuarioComponent,
      },
      
      {
        path: 'listar-empresa/ediciones/:id',
        component: CreaeditaEmpresaComponent,
      }
      
    ],
  },

  {
    path: 'banco',
    component: BancoComponent,
    children: [
      {
        path: 'registrar_banco',
        component: CreaeditaBancoComponent,
      },
      {
        path: 'listar_banco',
        component: ListarBancoComponent,
      },
      {
        path: 'listar-banco/ediciones/:id',
        component: CreaeditaBancoComponent,
      }
    ],
  },
  {
    path: 'documento',
    component: DocumentoComponent,
    children: [
      {
        path: 'registrar_documento',
        component: CreaeditaDocumentoComponent,
      },
      {
        path: 'listar_documento',
        component: ListarDocumentoComponent,
      },
      {
        path: 'listar-documento/ediciones/:id',
        component: CreaeditaDocumentoComponent,
      }
    ],
  },
  {
    path: 'contrato',
    component: ContratoComponent,
    children: [
      {
        path: 'registrar_contrato',
        component: CreaeditaContratoComponent,
      },
      {
        path: 'listar_contrato',
        component: ListarContratoComponent,
      },
      {
        path: 'listar-contrato/ediciones/:id',
        component: CreaeditaContratoComponent,
      }
    ],
  },


  {
    path: 'cartera',
    component: CarteraComponent,
    children: [
      {
        path: 'registrar_cartera',
        component: CreaeditaCarteraComponent,
      },
      {
        path: 'listar_cartera',
        component: ListarCarteraComponent,
      },
      {
        path: 'listar-cartera/ediciones/:id',
        component: CreaeditaCarteraComponent,
      }
    ],
  },

];
