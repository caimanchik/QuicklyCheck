import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { ProfileComponent } from './profile.component';
import { ProfileMainComponent } from './shared/components/profile-main/profile-main.component';
import { SharedModule } from "../../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordComponent } from './shared/components/password/password.component';


const routes: Routes = [
  {
    path: '', component: ProfileComponent, children: [
      {
        path: '', component: ProfileMainComponent, pathMatch: 'full'
      },
      {
        path: 'password', component: PasswordComponent, pathMatch: 'full'
      },
    ]
  },
]

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileMainComponent,
    PasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class ProfileModule { }
