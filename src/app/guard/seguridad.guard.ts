import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { LoginService } from "../services/login.service";
// import { LoginService } from "../services/login.service";
// 

export const PublicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    router.navigateByUrl('/empresa/listar_empresa');
    return false;
  }

  return true;
};