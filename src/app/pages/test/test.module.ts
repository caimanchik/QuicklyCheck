import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { TestComponent } from './test.component';
import { TestInfoComponent } from "./shared/components/test-info/test-info.component";
import { SharedModule } from "../../shared/shared.module";
import { TestFillComponent } from './shared/components/test-fill/test-fill.component';
import { TestUploadComponent } from './shared/components/test-upload/test-upload.component';
import { CheckService } from "../../shared/services/check.service";
import { TestResultComponent } from './shared/components/test-result/test-result.component';


const routes: Routes = [
  {
    path: '', component: TestComponent, children: [
      {
        path: ':id', component: TestInfoComponent, pathMatch: 'full'
      },
      {
        path: ':id/fill', component: TestFillComponent, pathMatch: 'full'
      },
      {
        path: ':id/upload', component: TestUploadComponent, pathMatch: 'full'
      },
      {
        path: ':id/result', component: TestResultComponent, pathMatch: 'full'
      },
    ]
  }
]

@NgModule({
  declarations: [
    TestInfoComponent,
    TestComponent,
    TestFillComponent,
    TestUploadComponent,
    TestResultComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CheckService
  ]
})
export class TestModule { }
