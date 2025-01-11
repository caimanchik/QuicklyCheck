import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnChanges, Output,
  SimpleChanges
} from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { IBlankView } from "../../interfaces/Views/IBlankView";
import { appear } from "../../animations/appear";
import { opacityIn } from "../../animations/opacityIn";
import { IBlankValid } from "../../interfaces/Tests/Blanks/IBlankValid";

@Component({
  selector: 'app-blank-view',
  templateUrl: './blank-view.component.html',
  styleUrls: [
    './blank-view.component.scss',
    './styles/answers.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ]),
    trigger('opacityIn', [
      transition(':enter', useAnimation(opacityIn))
    ])
  ]
})
export class BlankViewComponent implements OnChanges {
  @Input() public view!: IBlankView

  @Output() public showClick = new EventEmitter<void>()
  @Output() public swipeEvent = new EventEmitter<number>()
  @Output() public saveEvent = new EventEmitter<IBlankValid>()

  protected isEdit: boolean = false

  constructor(
    private _cd: ChangeDetectorRef
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.['view']?.currentValue)
      return
  }

  protected toggleShow() {
    this.showClick.next()
  }

  protected swipe(delta: number) {
    this.swipeEvent.next(delta)
  }

  protected enableEditMod() {
    this.isEdit = true
    this._cd.markForCheck()
  }

  protected closeEditForm(blank: IBlankValid | void) {
    if (blank) {
      this.saveEvent.next(blank)
    }

    this.isEdit = false;
    this._cd.markForCheck()
  }
}
