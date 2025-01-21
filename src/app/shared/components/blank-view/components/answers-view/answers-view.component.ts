import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { IBlankView } from "../../../../interfaces/Views/IBlankView";

@Component({
  selector: 'app-answers-view',
  templateUrl: './answers-view.component.html',
  styleUrls: [
    './answers-view.component.scss',
    '../../styles/answers.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnswersViewComponent implements OnChanges {
  @Input() public view!: IBlankView
  @Input() public isLogged!: boolean

  @Output() public editEvent = new EventEmitter<void>()

  constructor(
    private _cd: ChangeDetectorRef
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.['view']?.currentValue)
      return

    this._cd.detectChanges()
  }

  protected startEdit() {
    this.editEvent.emit()
  }
}
