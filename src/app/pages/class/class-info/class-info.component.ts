import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { IClassAllInfo } from "../../../shared/interfaces/Classes/IClassAllInfo";
import { IRememberInfo } from "../../../shared/interfaces/Application/IRememberInfo";
import { ClassesService } from "../../../shared/services/classes.service";
import { ErrorService } from "../../../shared/services/infrastructure/error.service";
import { ActivatedRoute, Router } from "@angular/router";
import { appear } from "../../../shared/animations/appear";
import { leaveTransform } from "../../../shared/animations/leaveTransform";
import { getParamFromRoute } from "../../../shared/functions/application/getParamFromRoute";
import { ConfirmService } from "../../../shared/services/infrastructure/confirm.service";

@Component({
  selector: 'app-class-info',
  templateUrl: './class-info.component.html',
  styleUrls: ['./class-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ]),
    trigger('leave', [
      transition(':leave', useAnimation(leaveTransform))
    ])
  ],
})
export class ClassInfoComponent implements OnInit {
  protected classInfo!: IClassAllInfo
  protected rememberInfo: IRememberInfo = {
    studentsHidden: false,
    worksHidden: false
  }

  constructor(
    private _classesService: ClassesService,
    private _errorService: ErrorService,
    private _confirmService: ConfirmService,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _router: Router,
  ) { }

  public ngOnInit(): void {
    this._classesService.getAllClassInfo(getParamFromRoute(this._route))
      .pipe(this._errorService.passErrorWithMessage("Данного класса не существует", ["error"]))
      .subscribe(classInfo => {
        this.classInfo = classInfo
        this._cd.markForCheck()
      })

    this.toggleHideForElement("studentsHidden")
    this.toggleHideForElement("studentsHidden")
    this.toggleHideForElement("worksHidden")
    this.toggleHideForElement("worksHidden")
    this._cd.markForCheck()
  }

  protected createTest() {
    this._router.navigate(['class', this.classInfo.pk, 'create-test'])
  }

  protected createStudent() {
    this._router.navigate(['class', this.classInfo.pk, 'create-student'])
  }

  protected toggleHide(info: Partial<IRememberInfo>) {
    if (info.studentsHidden)
      this.toggleHideForElement("studentsHidden")
    if (info.worksHidden)
      this.toggleHideForElement("worksHidden")

    this._cd.markForCheck()
  }

  private toggleHideForElement(key: keyof IRememberInfo) {
    const now = localStorage.getItem(key) !== 'false'
    localStorage.setItem(key, (!now).toString())
    this.rememberInfo[key] = !now
  }

  protected renameClass() {
    this._router.navigate(['class', this.classInfo.pk, 'edit'])
  }

  protected openTest(testPk: number) {
    this._router.navigate(['/', 'test', testPk])
  }

  protected openStudent($event: MouseEvent, studentPk: number) {
    $event.preventDefault()

    this._router.navigate(['/', 'student', studentPk])
  }

  protected deleteClass() {
    this._confirmService.createConfirm({
      message: `Вы действительно хотите удалить класс ${this.classInfo.number}${this.classInfo.letter}`,
      buttonText: 'удалить'
    })
      .subscribe(isConfirmed => {
        if (!isConfirmed)
          return

        this._classesService.deleteClass(this.classInfo.pk)
          .subscribe(() => {
            this._router.navigate(['/', 'classes'])
          })
      })
  }

  protected navigateClasses() {
    this._router.navigate(['/', 'classes'])
  }
}
