import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CheckComponent } from './check.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { FillComponent } from './shared/components/fill/fill.component';
import { CheckService } from "../../shared/services/check.service";
import { MainCheckComponent } from "./shared/components/main-check/main-check.component";
import { UploadComponent } from './shared/components/upload/upload.component';
import { ResultComponent } from './shared/components/result/result.component';
import { TemporaryGuard } from "../../shared/guards/temporary.guard";

const routes: Routes = [
  {
    path: '', component: CheckComponent,
    children: [
      {
        path: '', component: MainCheckComponent, pathMatch: 'full', canActivate: [TemporaryGuard]
      },
      {
        path: 'fill', component: FillComponent, pathMatch: 'full', canActivate: [TemporaryGuard]
      },
      {
        path: 'upload', component: UploadComponent, pathMatch: 'full', canActivate: [TemporaryGuard]
      },
      {
        path: 'result', component: ResultComponent, pathMatch: 'full'
      },
    ]
  },
]

@NgModule({
  declarations: [
    CheckComponent,
    FillComponent,
    MainCheckComponent,
    UploadComponent,
    ResultComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgOptimizedImage,
  ],
  exports: [
    RouterModule,
    ResultComponent
  ],
  providers: [
    CheckService
  ]
})
export class CheckModule { }
