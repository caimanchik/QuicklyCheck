import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from "@angular/router";
import { ActiveDirective } from "../../shared/directives/active.directive";
import {ReactiveFormsModule} from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
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
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [
    RouterModule
  ]
})
export class LoginModule { }
