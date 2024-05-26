import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentService } from "../../../shared/services/student.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getParamFromRoute } from "../../../shared/functions/application/getParamFromRoute";
import { forkJoin, map, of, switchMap, zip } from "rxjs";
import { ClassesService } from "../../../shared/services/classes.service";
import { IStudentAllInfo } from "../../../shared/interfaces/Students/IStudentAllInfo";
import { BlankService } from "../../../shared/services/blank.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { appear } from "../../../shared/animations/appear";
import { ConfirmService } from "../../../shared/services/infrastructure/confirm.service";

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
  protected student!: IStudentAllInfo

  constructor(
    private _studentService: StudentService,
    private _classesService: ClassesService,
    private _blankService: BlankService,
    private _confirm: ConfirmService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this._studentService.getStudent(getParamFromRoute(this._route))
      .pipe(
        switchMap(student => {
          return forkJoin({
            classInfo: this._classesService.getClassInfo(student.grade)
              .pipe(
                map(classInfo => ({
                  ...classInfo,
                  letter: classInfo.letter.toUpperCase()
                }))
              ),
            works: student.works.length > 0
              ? zip(...student.works.map(work => this._blankService.parseBlanks([work]).pipe(map(w => w[0]))))
              : of([])
          })
            .pipe(
              map(infos => {
                return {
                  ...student,
                  classInfo: infos.classInfo,
                  works: infos.works.reverse().map(work => ({
                    right: work.correctCount,
                    actual: work.answers.length,
                    percentage: Math.round(work.correctCount / work.answers.length * 100),
                    ...work,
                  })),
                }
              })
            )
        })
      )
      .subscribe(student => {
        this.student = {
          ...student,
          name: student.name.split(' ').slice(0, 2).join(' ')
        }
        this._cd.markForCheck()
      })
  }

  protected showBlank(blankPk: number) {
    this._router.navigate(['/', 'blank', blankPk])
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
}
