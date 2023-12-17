import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../shared/animations/transform-opacity";
import { ClassesService } from "../../shared/services/classes.service";
import { DestroyService } from "../../shared/services/infrastructure/destroy.service";
import { Class } from "../../shared/interfaces/Classes/Class";

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss'],
  providers: [
    DestroyService
  ],
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
export class ClassesComponent implements OnInit {

  protected classes!: Class[];

  constructor(
    private _classes: ClassesService,
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this._classes.getClasses()
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(classes => {
        this.classes = classes
        this._cd.markForCheck()
      })
  }

  test(id: number = 0) {
    console.log(id)
  }
}
