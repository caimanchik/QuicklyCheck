import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlankComponent } from './blank.component';
import { BlankInfoComponent } from './shared/components/blank-info/blank-info.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { BlankInvalidInfoComponent } from './shared/components/blank-invalid-info/blank-invalid-info.component';

const routes: Routes = [
  {
    path: '', component: BlankComponent, children: [
      {
        path: ':id', component: BlankInfoComponent, pathMatch: 'full'
      },
      {
        path: 'wrong/:id', component: BlankInfoComponent, pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  declarations: [
    BlankComponent,
    BlankInfoComponent,
    BlankInvalidInfoComponent,
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
export class BlankModule { }
