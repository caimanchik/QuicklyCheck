import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { RouterLinkWithHref } from "@angular/router";
import { CardComponent } from './components/card/card.component';
import { ButtonComponent } from './components/button/button.component';
import { PatternComponent } from './components/pattern/pattern.component';
import { PhotoComponent } from './components/photo/photo.component';
import { ErrorComponent } from './components/error/error.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ActiveDirective } from "./directives/active.directive";
import { BlankViewComponent } from './components/blank-view/blank-view.component';
import { EscapeDirective } from './directives/escape.directive';
import { FormComponent } from './components/form/form.component';
import { ReactiveFormsModule } from "@angular/forms";
import { LoaderComponent } from './components/loader/loader.component';
import { BlanksViewComponent } from './components/blanks-view/blanks-view.component';
import { BlankEditComponent } from './components/blank-view/components/blank-edit/blank-edit.component';
import { AnswersViewComponent } from './components/blank-view/components/answers-view/answers-view.component';
import { ValidDirective } from './directives/valid.directive';
import { BreadCrumbsComponent } from './components/bread-crumbs/bread-crumbs.component';
import { AssessmentComponent } from './components/assessment/assessment.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CardComponent,
    ButtonComponent,
    PatternComponent,
    PhotoComponent,
    ErrorComponent,
    ConfirmComponent,
    BlankViewComponent,
    EscapeDirective,
    FormComponent,
    LoaderComponent,
    BlanksViewComponent,
    BlankEditComponent,
    AnswersViewComponent,
    ValidDirective,
    BreadCrumbsComponent,
    AssessmentComponent,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    CardComponent,
    ButtonComponent,
    PatternComponent,
    PhotoComponent,
    ErrorComponent,
    ConfirmComponent,
    BlankViewComponent,
    FormComponent,
    LoaderComponent,
    BlanksViewComponent,
    BreadCrumbsComponent,
  ],
  imports: [
    CommonModule,
    RouterLinkWithHref,
    NgOptimizedImage,
    ActiveDirective,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
