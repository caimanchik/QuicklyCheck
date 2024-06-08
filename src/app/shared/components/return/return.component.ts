import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnComponent {

  @Output() public returnEvent = new EventEmitter<void>()
  @Input() public lateMedia: boolean = false

  constructor() { }

  protected generateReturnEvent() {
    this.returnEvent.emit()
  }
}
