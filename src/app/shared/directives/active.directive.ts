import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appActive]',
  standalone: true
})
export class ActiveDirective implements OnInit {

  @Input() isActiveInit: boolean = false;

  constructor(
    private e: ElementRef
  ) {
  }

  public ngOnInit() {
    if (this.isActiveInit)
      this.onClick()
  }

  @HostListener('click') onClick() {
    if (this.e.nativeElement.classList.contains('active'))
      this.e.nativeElement.classList.remove('active')
    else
      this.e.nativeElement.classList.add('active')
  }
}
