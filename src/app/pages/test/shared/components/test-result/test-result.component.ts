import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, EmbeddedViewRef,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { CheckService } from "../../../../../shared/services/check.service";
import { take } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { IBlankParsed } from "../../../../../shared/interfaces/Tests/Blanks/IBlankParsed";
import { IBlankView } from "../../../../../shared/interfaces/Views/IBlankView";

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.scss'],
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
export class TestResultComponent implements AfterViewInit {
  @ViewChild('blankContainer', {read: ViewContainerRef}) private _blankContainer!: ViewContainerRef
  @ViewChild('blank', {read: TemplateRef, static: true}) private _blankTemplate!: TemplateRef<{ view: IBlankView }>

  protected blanks!: IBlankParsed[]

  private _viewContext!: IBlankView
  private _view!: EmbeddedViewRef<{view: IBlankView}>
  private _nowIndex = 0
  private _show = false

  constructor(
    private _check: CheckService,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _router: Router
  ) { }

  public ngAfterViewInit(): void {
    this._check.checkBlanks(+(this._route.snapshot.paramMap.get('id') ?? 0))
      .subscribe(blanks => {
        this.blanks = blanks
        this.createView()
      })
  }

  private createView() {
    this._viewContext = {
      blank: this.blanks[this._nowIndex],
      multi: this.blanks.length > 1,
      showDetail: this._show,
      isLogged: true
    }

    this._blankContainer.clear()
    this._view = this._blankContainer.createEmbeddedView(this._blankTemplate, {
      view: this._viewContext
    })

    this._cd.markForCheck()
  }

  protected swipe(delta: number) {
    if (this._nowIndex + delta < 0 || this._nowIndex + delta === this.blanks.length)
      return

    this._nowIndex += delta
    this.createView()
  }

  protected toggleShow() {
    this._show = !this._show
    this._viewContext = {
      ...this._viewContext,
      showDetail: this._show
    }

    this._view.context = {
      view: this._viewContext
    }

    this._view.markForCheck()
  }

  protected goToTests() {
    this._router.navigate(['test', +(this._route.snapshot.paramMap.get('id') ?? 0)])
  }
}
