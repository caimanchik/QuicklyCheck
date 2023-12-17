import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { ScrollService } from "./shared/services/infrastructure/scroll.service";
import { AuthService } from "./shared/services/auth.service";
import { take } from "rxjs";
import { UrlService } from "./shared/services/infrastructure/url.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'QuicklyCheck';

  constructor(
    private _scrollService: ScrollService,
    private _auth: AuthService,
    private _url: UrlService
  ) { }

  public ngOnInit() {
    this._auth.refresh()
      .pipe(take(1))
      .subscribe()
  }

  @HostListener('document:scroll', ['$event'])
  public onScroll(e: Event): void {
    // @ts-ignore
    this._scrollService.nextScrollPos((e.target as Element).scrollingElement.scrollTop);
  }
}
