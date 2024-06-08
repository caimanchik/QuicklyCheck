import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { FormControl, Validators } from "@angular/forms";
import { TestService } from "../../../shared/services/test.service";
import { ActivatedRoute, Router } from "@angular/router";
import { appear } from "../../../shared/animations/appear";
import { IBuildForm } from "../../../shared/interfaces/Forms/IBuildForm";
import { getParamFromRoute } from "../../../shared/functions/application/getParamFromRoute";
import { capitalizeFirstLetter } from "../../../shared/functions/application/capitalizeFirstLetter";

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ],
})
export class CreateTestComponent implements OnInit {
  protected buildForm!: IBuildForm

  constructor(
    private _test: TestService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.buildForm = this.getBuildForm()
    this._cd.markForCheck()
  }

  private getBuildForm(): IBuildForm {
    return {
      controls: [
        {
          control: new FormControl<string>('', {
            validators: Validators.required
          }),
          placeholder: 'Введите название работы',
          type: 'text'
        }
      ],
      title: 'Новая тестовая работа',
      submitText: 'Создать',
    }
  }

  protected create(values: string[]) {
    this._test.createTest({
      name: capitalizeFirstLetter(values[0]),
      grade: getParamFromRoute(this._route)
    })
      .subscribe(test => {
        this._router.navigate(['test', test.pk])
      })
  }

  protected navigateClass() {
    this._router.navigate(['/', 'class', getParamFromRoute(this._route)])
  }
}
