import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { ClassesComponent } from "./classes.component";
import { ClassListComponent } from './shared/components/class-list/class-list.component';
import { CreateComponent } from './shared/components/create/create.component';
import { ReactiveFormsModule } from "@angular/forms";
import { ClassAllInfoComponent } from './shared/components/class-all-info/class-all-info.component';
import { CreateTestComponent } from './shared/components/create-test/create-test.component';
import { CreateStudentComponent } from './shared/components/create-student/create-student.component';
import { RenameStudentComponent } from './shared/components/rename-student/rename-student.component';
import { RenameClassComponent } from "./shared/components/rename-class/rename-class.component";

const routes: Routes = [
  {
    path: '', component: ClassesComponent, children: [
      {
        path: '', component: ClassListComponent, pathMatch: 'full'
      },
      {
        path: 'create', component: CreateComponent, pathMatch: 'full'
      },
      {
        path: ':id', component: ClassAllInfoComponent, pathMatch: 'full'
      },
      {
        path: ':id/create-test', component: CreateTestComponent, pathMatch: 'full'
      },
      {
        path: ':id/create-student', component: CreateStudentComponent, pathMatch: 'full'
      },
      {
        path: ':id/rename-student', component: RenameStudentComponent, pathMatch: 'full'
      },
      {
        path: ':id/rename-class', component: RenameClassComponent, pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  declarations: [
    ClassesComponent,
    ClassListComponent,
    CreateComponent,
    ClassAllInfoComponent,
    CreateTestComponent,
    CreateStudentComponent,
    RenameStudentComponent,
    RenameClassComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgOptimizedImage,
    ReactiveFormsModule,
  ],
  exports: [
    RouterModule
  ]
})
export class ClassesModule { }
