import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClassesService } from "../../../../../shared/services/classes.service";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import { IClassAllInfo } from "../../../../../shared/interfaces/Classes/IClassAllInfo";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";

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
    ])
  ],
})
export class ClassAllInfoComponent implements OnInit {
  protected classInfo!: IClassAllInfo

  constructor(
    private _classes: ClassesService,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _router: Router
  ) { }

  public ngOnInit(): void {
    this._classes.getAllClassInfo(+(this._route.snapshot.paramMap.get('id') ?? 0))
      .pipe(take(1))
      .subscribe(classInfo => {
        this.classInfo = classInfo
        this._cd.markForCheck()
      })
  }

  protected createTest() {
    this._router.navigate(['classes', this.classInfo.pk, 'create-test'])
  }

  createStudent() {
    this._router.navigate(['classes', this.classInfo.pk, 'create-student'])
  }
}
