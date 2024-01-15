import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { TestComponent } from './test.component';
import { TestInfoComponent } from "./shared/components/test-info/test-info.component";
import { SharedModule } from "../../shared/shared.module";
import { TestFillComponent } from './shared/components/test-fill/test-fill.component';


const routes: Routes = [
  {
    path: '', component: TestComponent, children: [
      {
        path: ':id', component: TestInfoComponent, pathMatch: 'full'
      },
      {
        path: ':id/fill', component: TestFillComponent, pathMatch: 'full'
      },
    ]
  }
]

@NgModule({
  declarations: [
    TestInfoComponent,
    TestComponent,
    TestFillComponent
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
export class TestModule { }
