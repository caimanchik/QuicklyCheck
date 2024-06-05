import {
  ChangeDetectionStrategy,
  Component, EventEmitter,
  Input,
  OnChanges, Output,
  SimpleChanges
} from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { IBlankView } from "../../interfaces/Views/IBlankView";
import { IResultView } from "../../interfaces/Views/IResultView";
import { appear } from "../../animations/appear";
import { calculateResult } from "../../functions/blanks/calculateResult";

@Component({
  selector: 'app-blank-view',
  templateUrl: './blank-view.component.html',
  styleUrls: ['./blank-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class BlankViewComponent implements OnChanges {
  @Input() public view!: IBlankView

  @Output() public showClick = new EventEmitter<void>()
  @Output() public swipeEvent = new EventEmitter<number>()

  protected resultView!: IResultView

  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.['view']?.currentValue)
      return

    this.resultView = calculateResult(changes?.['view']?.currentValue.blank)
  }

  protected toggleShow() {
    this.showClick.next()
  }

  protected swipe(delta: number) {
    this.swipeEvent.next(delta)
  }
}
