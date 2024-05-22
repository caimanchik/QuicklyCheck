import { ErrorHandler, InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from "./shared/shared.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TokenInterceptor } from "./shared/http-interceptors/token.interceptor";
import { ErrorService } from "./shared/services/infrastructure/error.service";
import { AuthService } from "./shared/services/auth.service";
import { UrlService } from "./shared/services/infrastructure/url.service";

export const AuthToken = new InjectionToken("auth");
export const UrlToken = new InjectionToken("url");

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    // {
    //   provide: ErrorHandler,
    //   useExisting: ErrorService
    // },
    {
      provide: AuthToken,
      useClass: AuthService,
      multi: false
    },
    {
      provide: UrlToken,
      useClass: UrlService,
      multi: false
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
