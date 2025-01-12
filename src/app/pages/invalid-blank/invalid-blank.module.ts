import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvalidBlankComponent } from './invalid-blank.component';
import { BlankInfoComponent } from './shared/components/blank-info/blank-info.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  {
    path: '', component: InvalidBlankComponent, children: [
      {
        path: ':id', component: BlankInfoComponent, pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  declarations: [
    InvalidBlankComponent,
    BlankInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    RouterModule
  ]
})
export class InvalidBlankModule { }
