import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PatternParsed } from "../../interfaces/Tests/Patterns/PatternParsed";

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss']
})
export class PatternComponent {
  @Input() public patterns!: PatternParsed[]
  @Output() public patternChanges = new EventEmitter<PatternParsed>()

  protected selected = 0

  protected varIs = [1, 2, 3, 4, 5, 6, 7, 8]

  constructor() { }

  protected readonly Array = Array;

  protected changePattern(varI: number) {
    this.selected = varI - 1
  }
}
