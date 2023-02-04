import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SignInOverviewComponent } from './sign-in-overview/sign-in-overview.component';
import { SignUpOverviewComponent } from './sign-up-overview/sign-up-overview.component';
import { MainpageComponent } from './mainpage/mainpage.component';

const routes: Routes = [
  // { path: '', component: MainpageComponent}, //ggf. auskommentieren, um wieder auf "signin" zu kommen
  { path: 'signin', component: SignInOverviewComponent },
  { path: 'signup', component: SignUpOverviewComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'signin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
