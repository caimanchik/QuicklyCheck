import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import {RouterLinkWithHref} from "@angular/router";


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterLinkWithHref,
  ]
})
export class SharedModule { }
