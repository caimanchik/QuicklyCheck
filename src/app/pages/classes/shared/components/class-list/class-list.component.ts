import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IClass } from "../../../../../shared/interfaces/Classes/IClass";
import { ClassesService } from "../../../../../shared/services/classes.service";
import { Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { take } from "rxjs";
import { ConfirmService } from "../../../../../shared/services/infrastructure/confirm.service";

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss'],
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassListComponent implements OnInit {

  protected classes!: IClass[];

  constructor(
    private _classes: ClassesService,
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _confirm: ConfirmService
  ) { }

  public ngOnInit(): void {
    this._classes.getClasses()
      .subscribe(classes => {
        this.classes = classes
        this._cd.markForCheck()
      })
  }

  protected createClass() {
    this._router.navigate(['classes', 'create'])
  }

  protected openClass(id: number) {
    this._router.navigate(["classes", id])
  }

  protected deleteClass(id: number) {
    this._confirm.createConfirm({
      message: "Вы действительно хотите удалить класс?",
      buttonText: "удалить"
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        this._classes.deleteClass(id)
          .subscribe(() => {
            this.classes = this.classes.filter(c => c.pk !== id)
            this._cd.markForCheck()
          })
      })
  }

}
