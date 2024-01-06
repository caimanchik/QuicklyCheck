import { AfterViewChecked, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PatternParsed } from "../../interfaces/Tests/Patterns/PatternParsed";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../animations/transform-opacity";
import { ErrorService } from "../../services/infrastructure/error.service";

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
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
  ],
})
export class PatternComponent implements AfterViewChecked {
  @Input() public patterns!: PatternParsed[]
  @Output() public patternChanges = new EventEmitter<PatternParsed>()
  @Output() public nextClicked = new EventEmitter<void>()

  protected selected = 0
  protected filled = [false, false, false, false, false, false, false, false]

  constructor(
    private _error: ErrorService
  ) { }

  public ngAfterViewChecked(): void {
    this.updateFilling()
  }

  protected changePattern(varI: number) {
    this.selected = varI - 1

    if (this.patterns.length < varI) {
      for (let i = this.patterns.length; i < varI; i++) {
        this.patterns.push({
          pattern: Array<number>(40).fill(-1),
          num: i + 1,
          test: 3,
          pk: 2
        })
      }
    }

    this.updateFilling()
  }

  protected addAnswer(question: number, value: number) {
    if (question > 0 && this.patterns[this.selected].pattern[question - 1] === -1) {
      this._error.createError('Нельзя оставлять пробелы')
      return
    }

    if (this.patterns[this.selected].pattern[question] === value) {
      if (question !== 39 && this.patterns[this.selected].pattern[question + 1] !== -1) {
        this._error.createError('Нельзя оставлять пробелы')
        return
      }
      value = -1
    }

    this.patterns[this.selected].pattern[question] = value

    this.patternChanges.next(this.patterns[this.selected]);
    this.updateFilling()
  }

  private updateFilling() {
    if (this.patterns)
      this.filled = this.patterns.map(e => e.pattern[0] !== -1)
  }

  protected clickButton() {
    this.nextClicked.next()
  }
}
