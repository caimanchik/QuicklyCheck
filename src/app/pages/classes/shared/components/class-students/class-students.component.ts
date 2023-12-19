import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from "../../../../../shared/services/infrastructure/destroy.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { ClassesService } from "../../../../../shared/services/classes.service";
import { Student } from "../../../../../shared/interfaces/Students/Student";
import { ActivatedRoute } from "@angular/router";
import { Class } from "../../../../../shared/interfaces/Classes/Class";
import { Location } from "@angular/common";

@Component({
  selector: 'app-class-students',
  templateUrl: './class-students.component.html',
  styleUrls: ['./class-students.component.scss'],
  providers: [DestroyService],
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
export class ClassStudentsComponent implements OnInit {

  protected students!: Student[]
  protected classInfo!: Class

  constructor(
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef,
    private _classes: ClassesService,
    private _route: ActivatedRoute,
    private _location: Location
  ) { }

  public ngOnInit(): void {
    const classId = +(this._route.snapshot.paramMap.get('id') ?? 0)

    this.getStudents(classId)
    this.getClass(classId)
  }

  private getStudents(classId: number) {
    this._classes.getClassStudents(classId)
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(students => {
        this.students = students
        this._cd.markForCheck()
      })
  }

  private getClass(classId: number) {
    let classFromState = (this._location.getState() as any)["classInfo"]
    if (classFromState) {
      this.classInfo = classFromState as Class
      return
    }

    this._classes.getClassInfo(classId)
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(classInfo => {
        this.classInfo = classInfo
        this._cd.markForCheck()
      })
  }
}
