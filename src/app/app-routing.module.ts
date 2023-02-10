import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SignInOverviewComponent } from './sign-in-overview/sign-in-overview.component';
import { SignUpOverviewComponent } from './sign-up-overview/sign-up-overview.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { VarifyEmailComponent } from './varify-email/varify-email.component';
import { ImprintComponent } from './imprint/imprint.component';
import { ThreadsComponent } from './threads/threads.component';
import { ChannelComponent } from './channel/channel.component';

const routes: Routes = [
  { path: 'mainpage', component: MainpageComponent}, //ggf. auskommentieren, um wieder auf "signin" zu kommen
  // { path: 'mainpage', component: MainpageComponent, canActivate: [AuthGuard] }, //ggf. auskommentieren, um wieder auf "signin" zu kommen
  { path: 'signin', component: SignInOverviewComponent },
  { path: 'signup', component: SignUpOverviewComponent },
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'varify-email', component: VarifyEmailComponent, canActivate: [AuthGuard] },
  { path: 'imprint', component: ImprintComponent },
  { path: 'threads', component: ThreadsComponent },
  { path: 'channel/:id', component: ChannelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
