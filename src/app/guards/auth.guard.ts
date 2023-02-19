import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private afAuth: AngularFireAuth, private router: Router) {

  }


  //user have to be authenticated to get access to the other paths than signin
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const user = await this.afAuth.currentUser;
    const isAuthenticated = user ? true : false;
    if (!isAuthenticated)
      this.router.navigate(['/signin']);
    return isAuthenticated;
  }
}
