import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private previousUrl: string;
  private currentUrl: string;

  constructor(
    private router: Router
  ) {
    this.currentUrl = this.router.url;
    this.previousUrl = "/";

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        let end = event as NavigationEnd;
        this.previousUrl = this.currentUrl;
        this.currentUrl = end.urlAfterRedirects;
      });
  }

  public getPreviousUrl() {
    return this.previousUrl === '/' ? '' : this.previousUrl;
  }

  public setNowUrl(url: string) {
    this.currentUrl = url;
  }
}
