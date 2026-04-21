import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class TokenValidGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!!localStorage.getItem('Authorization')) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;

  }

}
