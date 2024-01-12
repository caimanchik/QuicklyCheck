import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClassesService } from "../../../../../shared/services/classes.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DestroyService } from "../../../../../shared/services/infrastructure/destroy.service";
import { Class } from "../../../../../shared/interfaces/Classes/Class";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
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
export class ClassComponent implements OnInit {

  protected classInfo!: Class;

  constructor(
    private _classes: ClassesService,
    private _route: ActivatedRoute,
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef,
    private _router: Router
  ) {
    console.log(true)
  }

  public ngOnInit(): void {
    this._classes.getClassInfo(+(this._route.snapshot.paramMap.get('id') ?? 0))
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(classInfo => {
        this.classInfo = classInfo
        this._cd.markForCheck()
      })
  }

  protected openStudents() {
    this._router.navigate(['classes', this.classInfo.pk, "students"], {
      state: {
        classInfo: this.classInfo
      }
    })
  }
}
