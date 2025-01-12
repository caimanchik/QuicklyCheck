import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EmbeddedViewRef,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { CheckService } from "../../../../../shared/services/check.service";
import { IBlankView } from "../../../../../shared/interfaces/Views/IBlankView";
import { Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { ConfirmService } from "../../../../../shared/services/infrastructure/confirm.service";
import { BlankService } from "../../../../../shared/services/blank.service";
import { appear } from "../../../../../shared/animations/appear";
import { IBlanksCheck } from "../../../../../shared/interfaces/Tests/Blanks/IBlanksCheck";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class ResultComponent implements AfterViewInit {
  @ViewChild('blankContainer', {read: ViewContainerRef}) private _blankContainer!: ViewContainerRef
  @ViewChild('blank', {read: TemplateRef, static: true}) private _blankTemplate!: TemplateRef<{ view: IBlankView }>

  protected blanks!: IBlanksCheck

  private _viewContext!: IBlankView
  private _view!: EmbeddedViewRef<{view: IBlankView}>
  private _nowIndex = 0
  private _show = false

  constructor(
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _checkService: CheckService,
    private _blank: BlankService,
    private _confirm: ConfirmService
  ) { }

  public ngAfterViewInit(): void {
    if (localStorage.getItem('checked')) {
      this._blank.getBlanks(+(localStorage.getItem('temp') ?? 0), true)
        .subscribe(blanks => {
          this.blanks = blanks
          this.createView()
        })
      return
    }
    else if (this._checkService.canCheck()) {
      this._checkService.checkBlanks(+(localStorage.getItem('temp') ?? 0), true)
        .subscribe(blanks => {
          this.blanks = blanks
          localStorage.setItem('checked', '1')
          this.createView()
        })

      return;
    }
    else
      this._router.navigate(['/', 'check', 'upload'])
  }

  private createView() {
    this._viewContext = {
      blank: this.blanks.blanks[this._nowIndex],
      arrows: {
        prev: true,
        next: true,
      },
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
    if (this._nowIndex + delta < 0 || this._nowIndex + delta === this.blanks.blanks.length)
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

  protected checkNew() {
    this._confirm.createConfirm({
      message: 'При проверке нового теста без регистрации результат данной проверки не сохранится. Проверить еще?',
      buttonText: 'проверить'
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        localStorage.removeItem('temp')
        localStorage.removeItem('checked')

        this._router.navigate(['check'])
      })
  }
}
