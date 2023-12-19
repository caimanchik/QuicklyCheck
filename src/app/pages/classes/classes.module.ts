import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassesComponent } from './classes.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { ClassComponent } from './shared/components/class/class.component';
import { ClassStudentsComponent } from './shared/components/class-students/class-students.component';

const routes: Routes = [
  {
    path: '', component: ClassesComponent, pathMatch: 'full'
  },
  {
    path: ':id', component: ClassComponent, pathMatch: 'full'
  },
  {
    path: ':id/students', component: ClassStudentsComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    ClassesComponent,
    ClassComponent,
    ClassStudentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule
  ]
})
export class ClassesModule { }
