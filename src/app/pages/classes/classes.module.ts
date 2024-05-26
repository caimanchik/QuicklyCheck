import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { ClassesComponent } from "./classes.component";
import { ClassListComponent } from './shared/components/class-list/class-list.component';
import { CreateComponent } from './shared/components/create/create.component';
import { ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
  {
    path: '', component: ClassesComponent, children: [
      {
        path: '', component: ClassListComponent, pathMatch: 'full'
      },
      {
        path: 'create', component: CreateComponent, pathMatch: 'full'
      },
    ]
  }
]

@NgModule({
  declarations: [
    ClassesComponent,
    ClassListComponent,
    CreateComponent,
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
