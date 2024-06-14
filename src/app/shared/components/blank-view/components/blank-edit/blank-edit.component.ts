import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { IBlankView } from "../../../../interfaces/Views/IBlankView";

@Component({
  selector: 'app-blank-edit',
  templateUrl: './blank-edit.component.html',
  styleUrls: [
    './blank-edit.component.scss',
    '../../styles/answers.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlankEditComponent implements OnInit, OnChanges {
  @Input() public view!: IBlankView

  constructor(
    private _cd: ChangeDetectorRef
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.['view']?.currentValue)
      return

    this._cd.markForCheck()
  }

  public ngOnInit(): void {
  }

  protected saveEvent() {

  }
}
