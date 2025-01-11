import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { animate, style, transition, trigger, useAnimation } from "@angular/animations";
import { IClassAllInfo } from "../../../shared/interfaces/Classes/IClassAllInfo";
import { IRememberInfo } from "../../../shared/interfaces/Application/IRememberInfo";
import { ErrorService } from "../../../shared/services/infrastructure/error.service";
import { ActivatedRoute, Router } from "@angular/router";
import { appear } from "../../../shared/animations/appear";
import { leaveTransform } from "../../../shared/animations/leaveTransform";
import { getParamFromRoute } from "../../../shared/functions/application/getParamFromRoute";
import { ConfirmService } from "../../../shared/services/infrastructure/confirm.service";
import { ClassService } from "../../../shared/services/class.service";
import { createLineChart } from "../../../shared/functions/charts/createLineChart";
import { Chart } from "chart.js";
import { Timelines } from "../../../shared/enums/Timelines";
import { StatsService } from "../../../shared/services/stats.service";
import { IStats } from "../../../shared/interfaces/Stats/IStats";

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
    ]),
    trigger('leaveWait', [
      transition(':leave', [
        style({
          opacity: '1',
        }),
        animate(
          '100ms 200ms',
          style({
            opacity: '0',
          })
        )
      ])
    ]),
  ],
})
export class ClassInfoComponent implements OnInit {
  @ViewChild('lineChart', { read: ElementRef }) private _chartElement!: ElementRef
  @ViewChild('chartWrapper', { read: ElementRef }) private _chartWrapper!: ElementRef
  private _chart!: Chart
  private dimensions!: { width: number, height: number }

  @ViewChildren("timelineChanger") private _timelineChangers!: { nativeElement: any }[]
  private selectedTimeline!: Timelines;
  protected readonly Timelines = Timelines;

  protected classInfo!: IClassAllInfo
  protected rememberInfo: IRememberInfo = {
    studentsHidden: false,
    worksHidden: false
  }

  constructor(
    private _classService: ClassService,
    private _statsService: StatsService,
    private _errorService: ErrorService,
    private _confirmService: ConfirmService,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _router: Router,
  ) { }

  public ngOnInit(): void {
    const classPk = getParamFromRoute(this._route)
    this._classService.getById(classPk)
      .pipe(this._errorService.passErrorWithMessage("Данного класса не существует", ["error"]))
      .subscribe(classInfo => {
        this.classInfo = classInfo
        this._cd.markForCheck()
        this.changeTimeline(Timelines.Month, undefined, classPk)
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

  protected changeTimeline(timeline: Timelines, element?: HTMLElement, classPk?: number) {
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

    this._statsService.getClassStats(classPk ?? this.classInfo.pk, timeline)
      .pipe(this._errorService.passErrorWithMessage("Не удалось загрузить статистику", [], false))
      .subscribe(stats => {
        console.log(stats)
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

  private toggleHideForElement(key: keyof IRememberInfo) {
    const now = localStorage.getItem(key) !== 'false'
    localStorage.setItem(key, (!now).toString())
    this.rememberInfo[key] = !now
  }

  protected renameClass() {
    this._router.navigate(['class', this.classInfo.pk, 'edit'])
  }

  protected openTest($event: MouseEvent, testPk: number) {
    $event.preventDefault()
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

        this._classService.deleteClass(this.classInfo.pk)
          .subscribe(() => {
            this._router.navigate(['/', 'classes'])
          })
      })
  }

  protected navigateClasses() {
    this._router.navigate(['/', 'classes'])
  }
}
