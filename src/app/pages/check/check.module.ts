import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CheckComponent } from './check.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { FillComponent } from './shared/components/fill/fill.component';

const routes: Routes = [
  {
    path: '', component: CheckComponent, pathMatch: 'full'
  },
  {
    path: 'fill', component: FillComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    CheckComponent,
    FillComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgOptimizedImage,
  ],
  exports: [
    RouterModule
  ]
})
export class CheckModule { }
