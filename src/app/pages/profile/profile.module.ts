import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { ProfileComponent } from './profile.component';
import { ProfileMainComponent } from './shared/components/profile-main/profile-main.component';
import { SharedModule } from "../../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";


const routes: Routes = [
  {
    path: '', component: ProfileComponent, children: [
      {
        path: '', component: ProfileMainComponent, pathMatch: 'full'
      },
    ]
  },
]

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileMainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class ProfileModule { }
