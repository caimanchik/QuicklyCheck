import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentService } from "../../../shared/services/student.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getParamFromRoute } from "../../../shared/functions/application/getParamFromRoute";
import { transition, trigger, useAnimation } from "@angular/animations";
import { appear } from "../../../shared/animations/appear";
import { ConfirmService } from "../../../shared/services/infrastructure/confirm.service";
import { ErrorService } from "../../../shared/services/infrastructure/error.service";
import { IStudentAllInfoRequest } from "../../../shared/interfaces/Students/IStudentAllInfoRequest";
import { Timelines } from "../../../shared/enums/Timelines";

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("appear", [
      transition(":enter", useAnimation(appear))
    ])
  ]
})
export class StudentInfoComponent implements OnInit {
  protected student!: IStudentAllInfoRequest

  constructor(
    private _studentService: StudentService,
    private _errorService: ErrorService,
    private _confirm: ConfirmService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this._studentService.getById(getParamFromRoute(this._route))
      .pipe(this._errorService.passErrorWithMessage("Не удалось загрузить студента"))
      .subscribe(student => {
        this.student = {
          ...student,
          name: student.name.split(' ').slice(0, 2).join(' ')
        }
        this._cd.markForCheck()
      })
  }

  protected showBlank(blankPk: number) {
    this._router.navigate(['/', 'blank', blankPk], {
      state: {
        blanks: this.student.works,
        previousUrl: this._router.url
      }
    })
  }

  protected deleteStudent() {
    this._confirm.createConfirm({
      message: 'Вы действительно хотите удалить ученика?',
      buttonText: 'Удалить'
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        this._studentService.deleteStudent(this.student.pk)
          .subscribe(() => this._router.navigate(['class', this.student.grade]))
      })
  }

  protected rename() {
    this._router.navigate(['student', this.student.pk, 'rename'])
  }

  protected navigateClass() {
    this._router.navigate(['/', 'class', this.student.gradeDetail.pk])
  }

  protected readonly Timelines = Timelines;
}
