import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClassesService } from "../../../../../shared/services/classes.service";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import { IClassAllInfo } from "../../../../../shared/interfaces/Classes/IClassAllInfo";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { IRememberInfo } from "../../../../../shared/interfaces/IRememberInfo";

@Component({
  selector: 'app-class-all-info',
  templateUrl: './class-all-info.component.html',
  styleUrls: ['./class-all-info.component.scss'],
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
    ]),
    trigger('leave', [
      transition(':leave',
        useAnimation(transformOpacity), {
          params: {
            oStart: 1,
            oEnd: 0,
            transformStart: "translateY(0px)",
            transformEnd: "translateY(10px)",
          }
        }),
    ])
  ],
})
export class ClassAllInfoComponent implements OnInit {
  protected classInfo!: IClassAllInfo
  protected rememberInfo: IRememberInfo = {
    studentsHidden: false,
    worksHidden: false
  }

  constructor(
    private _classes: ClassesService,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _router: Router,
  ) { }

  public ngOnInit(): void {
    this._classes.getAllClassInfo(+(this._route.snapshot.paramMap.get('id') ?? 0))
      .pipe(take(1))
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
    this._router.navigate(['classes', this.classInfo.pk, 'create-test'])
  }

  protected createStudent() {
    this._router.navigate(['classes', this.classInfo.pk, 'create-student'])
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
    this._router.navigate(['classes', this.classInfo.pk, 'rename-class'])
  }
}
