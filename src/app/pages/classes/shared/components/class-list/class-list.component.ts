import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Class } from "../../../../../shared/interfaces/Classes/Class";
import { ClassesService } from "../../../../../shared/services/classes.service";
import { Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { take } from "rxjs";

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss'],
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassListComponent implements OnInit {

  protected classes!: Class[];

  constructor(
    private _classes: ClassesService,
    private _cd: ChangeDetectorRef,
    private _router: Router
  ) { }

  public ngOnInit(): void {
    this._classes.getClasses()
      .pipe(take(1))
      .subscribe(classes => {
        this.classes = classes
        this._cd.markForCheck()
      })
  }

  protected createClass() {
    this._router.navigate(['classes', 'create'])
  }

  protected openClass(id: number) {
    this._router.navigate(["classes", id])
  }

  protected deleteClass(id: number) {
    this._classes.deleteClass(id)
      .pipe(take(1))
      .subscribe(() => {
        this.classes = this.classes.filter(c => c.pk !== id)
        this._cd.markForCheck()
      })
  }

}
