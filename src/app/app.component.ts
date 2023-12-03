import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { ScrollService } from "./shared/services/infrastructure/scroll.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'QuicklyCheck';

  constructor(
    private _scrollService: ScrollService
  ) { }

  @HostListener('document:scroll', ['$event'])
  public onScroll(e: Event): void {
    // @ts-ignore
    this._scrollService.nextScrollPos((e.target as Element).scrollingElement.scrollTop);
  }
}
