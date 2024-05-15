import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appActive]',
  standalone: true
})
export class ActiveDirective {

  constructor(
    private e: ElementRef
  ) {
  }

  @HostListener('click') onClick() {
    if (this.e.nativeElement.classList.contains('active'))
      this.e.nativeElement.classList.remove('active')
    else
      this.e.nativeElement.classList.add('active')
  }
}
