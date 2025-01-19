import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appEscape]'
})
export class EscapeDirective {

  @Output() public escapeEvent: EventEmitter<void> = new EventEmitter();

  constructor() { }

  @HostListener("document:keydown.escape", ["$event"])
  private EscapeHandler(event: KeyboardEvent) {
    this.escapeEvent.emit();
  }
}
