import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EmbeddedViewRef, EventEmitter,
  Input, OnChanges, Output, SimpleChanges,
  TemplateRef,
  ViewChild, ViewContainerRef
} from '@angular/core';
import { IBlankViewContext } from "../../interfaces/Views/IBlankViewContext";
import { transition, trigger, useAnimation } from "@angular/animations";
import { appear } from "../../animations/appear";
import { IBlankValid } from "../../interfaces/Tests/Blanks/IBlankValid";
import { IBlankInvalid } from "../../interfaces/Tests/Blanks/IBlankInvalid";
import { IBlankView } from "../../interfaces/Views/IBlankView";
import { IBlankUpdate } from "../../interfaces/Tests/Blanks/IBlankUpdate";
import { IBlanksCheck } from "../../interfaces/Tests/Blanks/IBlanksCheck";
import { ITempBlankValid } from "../../interfaces/Tests/Blanks/ITempBlankValid";

@Component({
  selector: 'app-blanks-view',
  templateUrl: './blanks-view.component.html',
  styleUrls: ['./blanks-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class BlanksViewComponent implements AfterViewInit, OnChanges {

  @ViewChild('blankContainer', {read: ViewContainerRef}) private _blankContainer!: ViewContainerRef
  @ViewChild('blank', {read: TemplateRef, static: true}) private _blankTemplate!: TemplateRef<{ view: IBlankViewContext }>

  @Input() public blanks!: IBlanksCheck
  @Input() public showIndex = 0
  @Input() public buttonText = "назад"
  @Input() public isLogged = true

  @Output() public previousClickEvent = new EventEmitter<void>()
  @Output() public saveEvent = new EventEmitter<IBlankUpdate>()

  private _viewContext!: IBlankViewContext
  private _view!: EmbeddedViewRef<{view: IBlankViewContext}>
  private _showDetail = false

  constructor(
    private _cd: ChangeDetectorRef,
  ) { }

  public ngOnChanges(changes: SimpleChanges) {
    if (!changes?.['blanks'].currentValue || changes?.['blanks'].firstChange)
      return

    if (this.blanksLength === 0)
      return;

    this.createView(this.getBlankAt(this.showIndex), this._showDetail)
  }

  public ngAfterViewInit(): void {
    if (this.blanksLength > 0)
      this.createView(this.getBlankAt(this.showIndex))
  }

  protected swipe(delta: number) {
    if (this.showIndex + delta < 0 || this.showIndex + delta === this.blanksLength)
      return

    this.showIndex += delta
    this.createView(this.getBlankAt(this.showIndex), this._showDetail)
  }

  protected toggleShow() {
    this._showDetail = !this._showDetail
    this._viewContext = {
      ...this._viewContext,
      showDetail: this._showDetail
    }

    this._view.context = {
      view: this._viewContext
    }

    this._view.markForCheck()
  }

  protected emitPreviousClick() {
    this.previousClickEvent.emit()
  }

  protected save(blank: IBlankUpdate) {
    this.saveEvent.next(blank)
  }

  private createView(blank: IBlankValid | IBlankInvalid | ITempBlankValid, showDetail: boolean = false) {
    const blankView = this.getBlankView(blank)

    this._viewContext = {
      blank: blankView,
      arrows: {
        prev: this.showIndex > 0,
        next: this.showIndex < this.blanksLength - 1
      },
      showDetail: showDetail,
      isLogged: this.isLogged
    }

    this._blankContainer.clear()
    this._view = this._blankContainer.createEmbeddedView(this._blankTemplate, {
      view: this._viewContext
    })

    this._cd.detectChanges()
  }

  private getBlankView(blank: IBlankValid | IBlankInvalid | ITempBlankValid): IBlankView {
    const result: IBlankView = {
      pk: blank.pk,
      quiz: typeof (blank.quiz) === 'number' ? blank.quiz : blank.quiz.pk,
      image: blank.image,
      createdAt: blank.createdAt
    }

    if ('authorInfo' in blank)
      result.authorInfo = blank.authorInfo.name
    if ('idBlank' in blank) {
      result.idBlank = blank.idBlank
      result.authorInfo ??= blank.idBlank
    }
    if ('var' in blank)
      result.var = blank.var
    if ('testName' in blank)
      result.testName = blank.testName
    if ('answers' in blank)
      result.answers = blank.answers
    if ('blankScore' in blank)
      result.blankScore = blank.blankScore
    if ('assessment' in blank)
      result.assessment = blank.assessment

    return result
  }

  private get blanksLength(): number {
    return this.blanks.blanks.length + this.blanks.withoutPattern.length + this.blanks.invalidBlanks.length
  }

  private getBlankAt(i: number) {
    if (i < this.blanks.blanks.length)
      return this.blanks.blanks[i]

    i -= this.blanks.blanks.length
    if (i < this.blanks.withoutPattern.length)
      return this.blanks.withoutPattern[i]

    i -= this.blanks.withoutPattern.length
    return this.blanks.invalidBlanks[i]
  }
}
