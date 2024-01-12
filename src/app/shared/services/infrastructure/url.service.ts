import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private _previousUrl: string;
  private _currentUrl: string;

  constructor(
    private router: Router
  ) {
    this._currentUrl = this.router.url
    this._previousUrl = "/"

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        let end = event as NavigationEnd
        this._previousUrl = this._currentUrl
        this._currentUrl = end.urlAfterRedirects
      });
  }

  public getPreviousUrl() {
    return this._previousUrl === '/' ? '' : this._previousUrl
  }

  public setCurrentUrl(url: string) {
    this._currentUrl = url
  }

  public getCurrentUrl(): string {
    return this._currentUrl
  }
}
