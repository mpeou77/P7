import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
    if (this.auth.getToken()) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
