import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NavComponent } from './nav/nav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';

import { UserServiceService } from './services/user-service.service';
import { PeerLogic } from './dashboard/peerLogic';
import { ModalLogic } from './dashboard/modalLogic';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://127.0.0.1:3333', options: {} };






export function basicLoader(user: UserServiceService){
  return () => {
    user.initUser()
  }
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    WelcomeComponent,
    NavComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [UserServiceService, PeerLogic, ModalLogic, {provide: APP_INITIALIZER, useFactory: basicLoader, deps: [UserServiceService], multi: true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
