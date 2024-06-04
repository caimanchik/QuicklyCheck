import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./shared/guards/auth.guard";
import { LoginGuard } from "./shared/guards/login.guard";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'getBlank',
    loadChildren: () => import('./pages/get-blank/get-blank.module').then(m => m.GetBlankModule),
  },
  {
    path: 'classes',
    loadChildren: () => import('./pages/classes/classes.module').then(m => m.ClassesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'class',
    loadChildren: () => import('./pages/class/class.module').then(m => m.ClassModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'student',
    loadChildren: () => import('./pages/student/student.module').then(m => m.StudentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'check',
    loadChildren: () => import('./pages/check/check.module').then(m => m.CheckModule),
  },
  {
    path: 'test',
    loadChildren: () => import('./pages/test/test.module').then(m => m.TestModule),
  },
  {
    path: 'blank',
    loadChildren: () => import('./pages/blank/blank.module').then(m => m.BlankModule),
  },
  {
    path: "**",
    loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: "enabled"
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
