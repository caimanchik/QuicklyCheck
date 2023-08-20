import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from "@angular/router";
import { ActiveDirective } from "../../shared/directives/active.directive";

const routes: Routes = [
  {
    path: '', component: LoginComponent
  }
]

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgOptimizedImage,
    ActiveDirective,
  ],
  exports: [
    RouterModule
  ]
})
export class LoginModule { }
