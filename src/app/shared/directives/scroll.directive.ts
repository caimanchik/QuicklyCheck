import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { DestroyService } from "../services/infrastructure/destroy.service";
import { ScrollService } from "../services/infrastructure/scroll.service";

@Directive({
  selector: '[appScroll]',
  providers: [DestroyService],
  standalone: true
})
export class ScrollDirective implements OnInit{

  @Input('appScroll') public percentage!: number

  constructor(
    private _destroy: DestroyService,
    private _scrollService: ScrollService,
    private _element: ElementRef,
  ) { }

  ngOnInit(): void {
    this._element.nativeElement.style.position = 'relative'
    this._element.nativeElement.style.transition = 'all ease 0.3s 0.3s'
    this.switchVisibility(10, 0)

    const minScroll = this._scrollService.scrollHeight / 100 * this.percentage

    setTimeout(() => this._scrollService.scrollY$
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(value => {
        const rect = this._element.nativeElement.getBoundingClientRect()

        if (rect.top + rect.height + minScroll < value + this._scrollService.scrollHeight) {
          this.switchVisibility(0, 1)
          this._destroy.ngOnDestroy()
        }
      }))

  }

  private switchVisibility(top: number, opacity: number) {
    this._element.nativeElement.style.left = '0px'
    this._element.nativeElement.style.top = `${top}px`
    this._element.nativeElement.style.opacity = `${opacity}`

    // this._cd.detectChanges()
  }
}
