import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SignInOverviewComponent } from './sign-in-overview/sign-in-overview.component';
import { SignUpOverviewComponent } from './sign-up-overview/sign-up-overview.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { VarifyEmailComponent } from './varify-email/varify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  { path: 'mainpage', component: MainpageComponent, canActivate: [AuthGuard] }, //ggf. auskommentieren, um wieder auf "signin" zu kommen
  { path: 'signin', component: SignInOverviewComponent },
  { path: 'signup', component: SignUpOverviewComponent },
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'varify-email', component: VarifyEmailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
