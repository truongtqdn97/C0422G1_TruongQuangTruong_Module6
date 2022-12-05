import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {SignUpComponent} from "./sign-up/sign-up.component";


const routes: Routes = [
  {path: "forgot-password", component: ForgotPasswordComponent},
  {path: "login",component: LoginComponent},
  {path: "reset-password", component: ResetPasswordComponent},
  {path: "sign-up", component: SignUpComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
