import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { RouterLinkWithHref } from "@angular/router";
import { CardComponent } from './components/card/card.component';
import { ButtonComponent } from './components/button/button.component';
import { TitleComponent } from './components/title/title.component';
import { PatternComponent } from './components/pattern/pattern.component';
import { PhotoComponent } from './components/photo/photo.component';
import { ErrorComponent } from './components/error/error.component';
import { ConfirmComponent } from './components/confirm/confirm.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CardComponent,
    ButtonComponent,
    TitleComponent,
    PatternComponent,
    PhotoComponent,
    ErrorComponent,
    ConfirmComponent,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    CardComponent,
    ButtonComponent,
    TitleComponent,
    PatternComponent,
    PhotoComponent,
    ErrorComponent,
    ConfirmComponent,
  ],
  imports: [
    CommonModule,
    RouterLinkWithHref,
    NgOptimizedImage,
  ]
})
export class SharedModule { }
