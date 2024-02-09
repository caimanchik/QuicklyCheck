import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { StudentService } from "../../../../../shared/services/student.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ICreateStudentForm } from "../../../../../shared/interfaces/Forms/ICreateStudentForm";
import { ErrorService } from "../../../../../shared/services/infrastructure/error.service";
import { IStudentCreate } from "../../../../../shared/interfaces/Students/IStudentCreate";

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.scss'],
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
export class CreateStudentComponent implements OnInit {
  protected createForm!: FormGroup<ICreateStudentForm>

  constructor(
    private _student: StudentService,
    private _error: ErrorService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.createForm = new FormGroup<ICreateStudentForm>({
      surname: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      name: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      batya: new FormControl<string>('', {
        nonNullable: true
      })
    })
  }

  protected create() {
    if (this.createForm.invalid)
      return

    const name = [
      this.createForm.controls.surname.value,
      this.createForm.controls.name.value,
      this.createForm.controls.batya.value
    ]
      .filter(e => !!e)
      .join(' ')

    const student: IStudentCreate = {
      name,
      grade: +(this._route.snapshot.paramMap.get('id') ?? 0)
    }

    this._student.createStudent(student)
      .pipe(this._error.passErrorWithMessage("Не удалось создать студента", ["classes", student.grade]))
      .subscribe(created => {
        this._router.navigate(['classes', created.grade])
      })
  }
}
