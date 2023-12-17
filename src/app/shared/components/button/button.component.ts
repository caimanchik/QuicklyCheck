import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnInit {

  @Output() public clickEvent = new EventEmitter<void>;
  @Input() public filled = false;

  constructor() { }

  public ngOnInit(): void {
  }

  protected handleClick() {
    this.clickEvent.next()
  }

}
