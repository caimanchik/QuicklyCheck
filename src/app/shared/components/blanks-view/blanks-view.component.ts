import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EmbeddedViewRef, EventEmitter,
  Input, Output,
  TemplateRef,
  ViewChild, ViewContainerRef
} from '@angular/core';
import { IBlankParsed } from "../../interfaces/Tests/Blanks/IBlankParsed";
import { IBlankView } from "../../interfaces/Views/IBlankView";
import { transition, trigger, useAnimation } from "@angular/animations";
import { appear } from "../../animations/appear";

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
export class BlanksViewComponent implements AfterViewInit {
  @ViewChild('blankContainer', {read: ViewContainerRef}) private _blankContainer!: ViewContainerRef
  @ViewChild('blank', {read: TemplateRef, static: true}) private _blankTemplate!: TemplateRef<{ view: IBlankView }>

  @Input() public blanks!: IBlankParsed[]
  @Input() public showIndex = 0

  @Output() public previousClickEvent = new EventEmitter<void>()

  private _viewContext!: IBlankView
  private _view!: EmbeddedViewRef<{view: IBlankView}>
  private _showDetail = false

  constructor(
    private _cd: ChangeDetectorRef,
  ) { }

  public ngAfterViewInit(): void {
    this.createView(this.blanks[this.showIndex])
  }

  private createView(blank: IBlankParsed, showDetail: boolean = false) {
    this._viewContext = {
      blank: blank,
      arrows: {
        prev: this.showIndex > 0,
        next: this.showIndex < this.blanks.length - 1
      },
      showDetail: showDetail,
      isLogged: true
    }

    this._blankContainer.clear()
    this._view = this._blankContainer.createEmbeddedView(this._blankTemplate, {
      view: this._viewContext
    })

    this._cd.detectChanges()
  }

  protected swipe(delta: number) {
    if (this.showIndex + delta < 0 || this.showIndex + delta === this.blanks.length)
      return

    this.showIndex += delta
    this.createView(this.blanks[this.showIndex], this._showDetail)
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
}
