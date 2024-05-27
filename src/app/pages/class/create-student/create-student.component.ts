import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { StudentService } from "../../../shared/services/student.service";
import { ErrorService } from "../../../shared/services/infrastructure/error.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IStudentCreate } from "../../../shared/interfaces/Students/IStudentCreate";
import { IBuildForm } from "../../../shared/interfaces/Forms/IBuildForm";
import { getParamFromRoute } from "../../../shared/functions/application/getParamFromRoute";
import { capitalizeFirstLetter } from "../../../shared/functions/application/capitalizeFirstLetter";

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateStudentComponent implements OnInit {
  protected buildForm!: IBuildForm

  constructor(
    private _student: StudentService,
    private _error: ErrorService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.buildForm = this.getBuildForm()
  }

  private getBuildForm(): IBuildForm {
    return {
      controls: [
        {
          control: new FormControl<string>('', {
            validators: Validators.required
          }),
          placeholder: 'Фамилия ученика',
          type: 'text'
        },
        {
          control: new FormControl<string>('', {
            validators: Validators.required
          }),
          placeholder: 'Имя ученика',
          type: 'text'
        },
        {
          control: new FormControl<string>('', {}),
          placeholder: 'Отчество ученика (при наличии)',
          type: 'text'
        }
      ],
      title: 'Добавить ученика',
      submitText: 'Добавить'
    }
  }

  protected create(values: string[]) {
    const name = [
      capitalizeFirstLetter(values[0]),
      capitalizeFirstLetter(values[1]),
      values[2] ? capitalizeFirstLetter(values[2]) : ''
    ]
      .filter(e => !!e)
      .join(' ')

    const student: IStudentCreate = {
      name,
      grade: getParamFromRoute(this._route)
    }

    this._student.createStudent(student)
      .pipe(this._error.passErrorWithMessage("Не удалось создать студента", ["classes", student.grade]))
      .subscribe(created => {
        this._router.navigate(['class', created.grade])
      })
  }
}
