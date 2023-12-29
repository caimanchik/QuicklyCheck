import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { ProfileComponent } from './profile.component';
import { EditPasswordComponent } from './shared/components/edit-password/edit-password.component';


const routes: Routes = [
  {
    path: '', component: ProfileComponent, pathMatch: 'full'
  },
  {
    path: 'editPassword', component: EditPasswordComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    ProfileComponent,
    EditPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProfileModule { }
