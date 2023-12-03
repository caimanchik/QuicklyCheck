import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { MainComponent } from './main.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {ScrollDirective} from "../../shared/directives/scroll.directive";

const routes: Routes = [
  {
    path: '', component: MainComponent
  }
]

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgOptimizedImage,
    SharedModule,
    ScrollDirective
  ],
  exports: [
    RouterModule
  ]
})
export class MainModule { }
