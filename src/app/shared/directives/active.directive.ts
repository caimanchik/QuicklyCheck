import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appActive]',
  standalone: true
})
export class ActiveDirective implements OnInit {

  @Input() isActiveInit: boolean = false;
  @Input() targetElement!: HTMLElement
  @Input() closeElement!: HTMLElement

  constructor(
    private e: ElementRef
  ) {
  }

  public ngOnInit() {
    if (this.isActiveInit)
      this.addClasses()

    this.closeElement?.addEventListener('click', e => {
      this.removeClasses()
    })

    this.targetElement?.addEventListener('click', e => {
      e.stopPropagation()
    })
  }

  @HostListener('click', ['$event'])
  onClick(e: PointerEvent) {
    e.stopPropagation()
    if (this.e.nativeElement.classList.contains('active'))
      this.removeClasses()
    else
      this.addClasses()
  }

  private addClasses() {
    this.e.nativeElement.classList.add('active')
    this.targetElement?.classList.add('active')
  }

  private removeClasses() {
    this.e.nativeElement.classList.remove('active')
    this.targetElement?.classList.remove('active')
  }
}
