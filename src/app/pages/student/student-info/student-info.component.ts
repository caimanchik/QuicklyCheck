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
import { StatsService } from "../../../shared/services/stats.service";

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
    private _statsService: StatsService,
    private _confirm: ConfirmService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    const studentPk = getParamFromRoute(this._route)
    this._studentService.getById(studentPk)
      .pipe(this._errorService.passErrorWithMessage("Не удалось загрузить студента"))
      .subscribe(student => {
        this.student = {
          ...student,
          name: student.name.split(' ').slice(0, 2).join(' ')
        }
        this._cd.markForCheck()
        this.changeTimeline(Timelines.Month, undefined, studentPk)
      })
  }

  protected changeTimeline(timeline: Timelines, element?: HTMLElement, studentPk?: number) {
    if (timeline == this.selectedTimeline)
      return
    this.selectedTimeline = timeline

    if (element) {
      this._timelineChangers.forEach(e => {
        e.nativeElement.classList.remove("active")
        e.nativeElement.classList.add("common")
      })

      element.classList.remove("common")
      element.classList.add("active")
    }

    this._statsService.getStudentStats(studentPk ?? this.student.pk, timeline)
      .pipe(this._errorService.passErrorWithMessage("Не удалось загрузить статистику", [], false))
      .subscribe(stats => {
        setTimeout(() => {
          this._chart?.destroy()
          this.dimensions ??= this._chartWrapper.nativeElement.getBoundingClientRect()

          this._chart = createLineChart(this._chartElement, this.dimensions,
            stats.stats.map(_ => ' '),
            stats.stats.map(s => +s.avg.toFixed(0)),
            [...this.getElementsWithStep(stats.stats.map(s => s.date))],
            ['100%', '90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%', '10%', '0%'])
        })
      })
  }

  private getElementsWithStep<T>(source: T[], count: number = 6) {
    if (source.length <= count) {
      return source;
    }

    const result = [];
    const step = (source.length - 1) / (count - 1);

    for (let i = 0; i < count; i++) {
      const index = Math.round(i * step);
      result.push(source[index]);
    }

    return result;
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
