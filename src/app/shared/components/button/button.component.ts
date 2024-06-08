import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {

  @Output() public clickEvent = new EventEmitter<void>;
  @Input() public mode: 'filled' | 'red' | 'default' = 'default'

  constructor() { }

  protected handleClick() {
    this.clickEvent.next()
  }

}
