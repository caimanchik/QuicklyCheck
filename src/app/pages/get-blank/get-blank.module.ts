import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {GetBlankComponent} from "./get-blank.component";
import {RouterModule, Routes} from "@angular/router";
import { SharedModule } from "../../shared/shared.module";

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
    SharedModule,
  ],
  exports: [
    RouterModule
  ]
})
export class GetBlankModule { }
