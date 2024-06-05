import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CheckComponent } from './check.component';
import {
  RouterModule,
  Routes
} from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { FillComponent } from './shared/components/fill/fill.component';
import { CheckService } from "../../shared/services/check.service";
import { MainCheckComponent } from "./shared/components/main-check/main-check.component";
import { UploadComponent } from './shared/components/upload/upload.component';
import { ResultComponent } from './shared/components/result/result.component';
import { CheckResultGuard } from "../../shared/guards/check-result.guard";
import { orderedAsyncGuards } from "../../shared/functions/application/orderedAsyncGuards";
import { CheckTempGuard } from "../../shared/guards/check-temp.guard";
import { CheckFillGuard } from "../../shared/guards/check-fill.guard";
import { CheckHasTempGuard } from "../../shared/guards/check-has-temp.guard";

const routes: Routes = [
  {
    path: '', component: CheckComponent,
    children: [
      {
        path: '',
        component: MainCheckComponent,
        pathMatch: 'full',
        // @ts-ignore
        canActivate: [orderedAsyncGuards([CheckResultGuard, CheckHasTempGuard])],
      },
      {
        path: 'fill',
        component: FillComponent,
        pathMatch: 'full',
        // @ts-ignore
        canActivate: [orderedAsyncGuards([CheckTempGuard, CheckResultGuard])],
      },
      {
        path: 'upload',
        component: UploadComponent,
        pathMatch: 'full',
        // @ts-ignore
        canActivate: [orderedAsyncGuards([CheckTempGuard, CheckResultGuard, CheckFillGuard])],
      },
      {
        path: 'result',
        component: ResultComponent,
        pathMatch: 'full',
        // @ts-ignore
        canActivate: [orderedAsyncGuards([CheckTempGuard])]
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
