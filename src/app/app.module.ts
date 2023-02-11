import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInOverviewComponent } from './sign-in-overview/sign-in-overview.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { SignUpOverviewComponent } from './sign-up-overview/sign-up-overview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainpageComponent } from './mainpage/mainpage.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VarifyEmailComponent } from './varify-email/varify-email.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogCreateChannelComponent } from './dialog-create-channel/dialog-create-channel.component';
import { DialogCreateChatComponent } from './dialog-create-chat/dialog-create-chat.component';
import { MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { ImprintComponent } from './imprint/imprint.component';
import { ThreadsComponent } from './threads/threads.component';
import { ChannelComponent } from './channel/channel.component';
import { DialogResetPasswordInfoComponent } from './dialog-reset-password-info/dialog-reset-password-info.component';
import { DialogErrorComponent } from './dialog-error/dialog-error.component'


@NgModule({
  declarations: [
    AppComponent,
    SignInOverviewComponent,
    SignUpOverviewComponent,
    MainpageComponent,
    ForgotPasswordComponent,
    VarifyEmailComponent,
    DialogCreateChannelComponent,
    DialogCreateChatComponent,
    ImprintComponent,
    ThreadsComponent,
    DialogResetPasswordInfoComponent,
    DialogErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
