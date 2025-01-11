import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { StudentService } from "../../../shared/services/student.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getParamFromRoute } from "../../../shared/functions/application/getParamFromRoute";
import { transition, trigger, useAnimation } from "@angular/animations";
import { appear } from "../../../shared/animations/appear";
import { ConfirmService } from "../../../shared/services/infrastructure/confirm.service";
import { ErrorService } from "../../../shared/services/infrastructure/error.service";
import { Timelines } from "../../../shared/enums/Timelines";
import { createLineChart } from "../../../shared/functions/charts/createLineChart";
import { Chart } from "chart.js";
import { IStudentAllInfo } from "../../../shared/interfaces/Students/IStudentAllInfo";

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

  @ViewChild('lineChart', { read: ElementRef }) private _chartElement!: ElementRef
  @ViewChild('chartWrapper', { read: ElementRef }) private _chartWrapper!: ElementRef
  private _chart!: Chart
  private dimensions!: { width: number, height: number }

  @ViewChildren("timelineChanger") private _timelineChangers!: { nativeElement: any }[]
  private selectedTimeline!: Timelines;
  protected readonly Timelines = Timelines;

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
        this.changeTimeline(Timelines.Month)
      })
  }

  protected changeTimeline(timeline: Timelines, element?: HTMLElement) {
    if (timeline == this.selectedTimeline) return

    this.selectedTimeline = timeline
    if (element) {
      this._timelineChangers.forEach(e => {
        e.nativeElement.classList.remove("active")
        e.nativeElement.classList.add("common")
      })

      element.classList.remove("common")
      element.classList.add("active")
    }

    setTimeout(() => {
      this._chart?.destroy()
      this.dimensions ??= this._chartWrapper.nativeElement.getBoundingClientRect()
      this._chart = createLineChart(this._chartElement, this.dimensions,
        ['', '5.12', '10.12', '15.12', '20.12', '25.12', '31.12'],
        [NaN, NaN, NaN, NaN, 70, 100, 90, 70],
        ['', '5.12', '10.12', '15.12', '20.12', '25.12', '31.12'],
        ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%', '10%', '0%'])
    })
  }

  protected showBlank(event: MouseEvent, blankPk: number) {
    event.preventDefault()
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
          .subscribe(() => this._router.navigate(['class', this.student.gradeDetail.pk]))
      })
  }

  protected rename() {
    this._router.navigate(['student', this.student.pk, 'rename'])
  }

  protected navigateClass() {
    this._router.navigate(['/', 'class', this.student.gradeDetail.pk])
  }
}
