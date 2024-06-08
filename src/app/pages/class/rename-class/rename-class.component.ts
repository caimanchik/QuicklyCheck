import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { IClass } from "../../../shared/interfaces/Classes/IClass";
import { ClassesService } from "../../../shared/services/classes.service";
import { ErrorService } from "../../../shared/services/infrastructure/error.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IBuildForm } from "../../../shared/interfaces/Forms/IBuildForm";
import { classCharValidator } from "../../../shared/validators/classCharValidator";
import { getParamFromRoute } from "../../../shared/functions/application/getParamFromRoute";
import { classNumberValidator } from "../../../shared/validators/classNumberValidator";

@Component({
  selector: 'app-rename-class',
  templateUrl: './rename-class.component.html',
  styleUrls: ['./rename-class.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenameClassComponent implements OnInit {
  protected classInfo!: IClass
  protected buildForm!: IBuildForm

  private classId!: number

  constructor(
    private _classes: ClassesService,
    private _error: ErrorService,
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.classId = getParamFromRoute(this._route)
    this._classes.getClassInfo(this.classId)
      .pipe(this._error.passErrorWithMessage("", ["class", this.classId]))
      .subscribe((clasInfo) => {
        this.classInfo = clasInfo
        this.buildForm = this.getBuildForm()
        this._cd.markForCheck()
      })
  }

  private getBuildForm(): IBuildForm {
    return {
      controls: [
        {
          control: new FormControl<string>('', {
            validators: classNumberValidator('Введите цифру от 1 до 11'),
          }),
          type: 'text',
          placeholder: 'Введите цифру класса'
        },
        {
          control: new FormControl<string>('', {
            validators: classCharValidator('Введите 1 русскую букву'),
          }),
          type: 'text',
          placeholder: 'Введите букву класса'
        },
      ],
      title: `Изменение класса ${this.classInfo.number}${this.classInfo.letter.toUpperCase()}`,
      submitText: 'Изменить',
    }
  }

  protected rename(values: string[]) {
    this._classes.renameClass({
      ...this.classInfo,
      number: values[0],
      letter: values[1].toUpperCase()
    })
      .pipe(this._error.passErrorWithMessage("не удалось переименовать класс", ["classes", this.classId]))
      .subscribe(editedClass => {
        this._router.navigate(['class', editedClass.pk])
      })
  }

  protected navigateClass() {
    this._router.navigate(['/', 'class', this.classId])
  }
}
