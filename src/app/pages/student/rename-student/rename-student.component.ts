import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IBuildForm } from "../../../shared/interfaces/Forms/IBuildForm";
import { FormControl, Validators } from "@angular/forms";
import { IStudent } from "../../../shared/interfaces/Students/IStudent";
import { StudentService } from "../../../shared/services/student.service";
import { getParamFromRoute } from "../../../shared/functions/application/getParamFromRoute";
import { ActivatedRoute, Router } from "@angular/router";
import { IStudentRename } from "../../../shared/interfaces/Students/IStudentRename";
import { capitalizeFirstLetter } from "../../../shared/functions/application/capitalizeFirstLetter";

@Component({
  selector: 'app-rename-student',
  templateUrl: './rename-student.component.html',
  styleUrls: ['./rename-student.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenameStudentComponent implements OnInit {
  protected buildForm!: IBuildForm
  protected student!: IStudent

  constructor(
    private _studentService: StudentService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _cd: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this._studentService.getStudent(getParamFromRoute(this._route))
      .subscribe(student => {
        this.student = student
        this.buildForm = this.getBuildForm()

        this._cd.markForCheck()
      })
  }

  private getBuildForm(): IBuildForm {
    const [surname, name, fatherName] = this.student.name.split(' ')
    return {
      controls: [
        {
          control: new FormControl<string>(surname, {
            validators: Validators.required
          }),
          placeholder: 'Фамилия ученика',
          type: 'text'
        },
        {
          control: new FormControl<string>(name, {
            validators: Validators.required
          }),
          placeholder: 'Имя ученика',
          type: 'text'
        },
        {
          control: new FormControl<string>(fatherName, {}),
          placeholder: 'Отчество ученика (при наличии)',
          type: 'text'
        }
      ],
      title: 'Изменить ученика',
      submitText: 'Изменить'
    }
  }

  protected rename(values: string[]) {
    const student: IStudentRename = {
      ...this.student,
      name: values.map(value => value ? capitalizeFirstLetter(value) : '').join(' '),
    }

    this._studentService.renameStudent(student)
      .subscribe(student => {
        this._router.navigate(['/', 'student', student.pk])
      })
  }
}
