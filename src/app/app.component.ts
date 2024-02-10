import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit } from '@angular/core';
import { ScrollService } from "./shared/services/infrastructure/scroll.service";
import { AuthService } from "./shared/services/auth.service";
import { AuthToken } from "./app.module";

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
    @Inject(AuthToken) private _auth: AuthService,
  ) { }

  public ngOnInit() {
    this._auth.refresh()
      .subscribe()
  }

  @HostListener('document:scroll', ['$event'])
  public onScroll(e: Event): void {
    // @ts-ignore
    this._scrollService.nextScrollPos((e.target as Element).scrollingElement.scrollTop);
  }
}
