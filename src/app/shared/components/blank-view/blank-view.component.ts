import {
  ChangeDetectionStrategy,
  Component, EventEmitter,
  Input,
  OnChanges, Output,
  SimpleChanges
} from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../animations/transform-opacity";
import { IBlankView } from "../../interfaces/Views/IBlankView";
import { IResultView } from "../../interfaces/Views/IResultView";
import { IBlankParsed } from "../../interfaces/Tests/Blanks/IBlankParsed";

@Component({
  selector: 'app-blank-view',
  templateUrl: './blank-view.component.html',
  styleUrls: ['./blank-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter',
        useAnimation(transformOpacity), {
          params: {
            oStart: 0,
            oEnd: 1,
            transformStart: "translateY(10px)",
            transformEnd: "translateY(0px)",
          }
        }),
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

    this.calculateResult(changes?.['view']?.currentValue.blank)
  }

  protected calculateResult(blank: IBlankParsed) {
    const actual = blank.answers.filter(e => e.isRight).length
    const right = blank.answers.length

    this.resultView = {
      actual,
      right,
      percentage: Math.round(actual / right * 100)
    }
  }

  protected toggleShow() {
    this.showClick.next()
  }

  protected swipe(delta: number) {
    this.swipeEvent.next(delta)
  }
}
