import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { appear } from "../../../../../shared/animations/appear";
import { IBuildForm } from "../../../../../shared/interfaces/Forms/IBuildForm";
import { classNumberValidator } from "../../../../../shared/validators/classNumberValidator";
import { classCharValidator } from "../../../../../shared/validators/classCharValidator";
import { ErrorService } from "../../../../../shared/services/infrastructure/error.service";
import { ClassService } from "../../../../../shared/services/class.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ],
})
export class CreateComponent implements OnInit {
  protected buildForm!: IBuildForm

  constructor(
    private _error: ErrorService,
    private _classService: ClassService,
    private _cd: ChangeDetectorRef,
    private _router: Router
  ) { }

  public ngOnInit(): void {
    this.buildForm = this.getBuildForm()
    this._cd.markForCheck()
  }

  protected create(values: string[]) {
    this._classService.createClass({
      number: values[0],
      letter: values[1].toUpperCase()
    })
      .pipe(this._error.passErrorWithMessage("не удалось создать класс", ["classes"]))
      .subscribe(createdClass => {
        this._router.navigate(['class', createdClass.pk])
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
      title: `Создать класс`,
      submitText: 'Создать',
    }
  }

  protected navigateClasses() {
    this._router.navigate(['/', 'classes'])
  }
}
