import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentComponent } from './student.component';
import { RouterModule, Routes } from "@angular/router";
import { StudentInfoComponent } from './student-info/student-info.component';
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  {
    path: '', component: StudentComponent, children: [
      {
        path: ':id', component: StudentInfoComponent, pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  declarations: [
    StudentComponent,
    StudentInfoComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class StudentModule { }
