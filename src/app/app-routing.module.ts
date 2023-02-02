import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInOverviewComponent } from './sign-in-overview/sign-in-overview.component';
import { SignUpOverviewComponent } from './sign-up-overview/sign-up-overview.component';

const routes: Routes = [

  { path: 'signin', component: SignInOverviewComponent },
  { path: 'signup', component: SignUpOverviewComponent },
  { path: '', redirectTo: 'signin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
