import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {GetBlankComponent} from "./get-blank.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '', component: GetBlankComponent
  }
]

@NgModule({
  declarations: [
    GetBlankComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgOptimizedImage,
  ],
  exports: [
    RouterModule
  ]
})
export class GetBlankModule { }
