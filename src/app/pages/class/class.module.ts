import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ClassComponent } from './class.component';
import { RouterModule, Routes } from "@angular/router";
import { ClassInfoComponent } from './class-info/class-info.component';
import { CreateTestComponent } from './create-test/create-test.component';
import { CreateStudentComponent } from './create-student/create-student.component';
import { RenameClassComponent } from './rename-class/rename-class.component';
import { SharedModule } from "../../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
  {
    path: '', component: ClassComponent, children: [
      {
        path: ':id', component: ClassInfoComponent, pathMatch: 'full'
      },
      {
        path: ':id/create-test', component: CreateTestComponent, pathMatch: 'full'
      },
      {
        path: ':id/create-student', component: CreateStudentComponent, pathMatch: 'full'
      },
      {
        path: ':id/edit', component: RenameClassComponent, pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  declarations: [
    ClassComponent,
    ClassInfoComponent,
    CreateTestComponent,
    CreateStudentComponent,
    RenameClassComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class ClassModule { }
