import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IClass } from "../../../../../shared/interfaces/Classes/IClass";
import { Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { ConfirmService } from "../../../../../shared/services/infrastructure/confirm.service";
import { appear } from "../../../../../shared/animations/appear";
import { ClassService } from "../../../../../shared/services/class.service";

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss'],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassListComponent implements OnInit {

  protected classes!: IClass[];

  constructor(
    private _classService: ClassService,
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _confirm: ConfirmService
  ) { }

  public ngOnInit(): void {
    this._classService.getAll()
      .subscribe(classes => {
        this.classes = classes
        this._cd.markForCheck()
      })
  }

  protected createClass() {
    this._router.navigate(['classes', 'create'])
  }

  protected openClass(id: number) {
    this._router.navigate(["class", id])
  }

  protected deleteClass(id: number) {
    this._confirm.createConfirm({
      message: "Вы действительно хотите удалить класс?",
      buttonText: "удалить"
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        this._classService.deleteClass(id)
          .subscribe(() => {
            this.classes = this.classes.filter(c => c.pk !== id)
            this._cd.markForCheck()
          })
      })
  }

}
