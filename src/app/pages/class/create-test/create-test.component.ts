import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ICreateTestForm } from "../../../shared/interfaces/Forms/ICreateTestForm";
import { TestService } from "../../../shared/services/test.service";
import { ActivatedRoute, Router } from "@angular/router";
import { appear } from "../../../shared/animations/appear";

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
  protected createForm!: FormGroup<ICreateTestForm>

  constructor(
    private _test: TestService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.createForm = new FormGroup<ICreateTestForm>({
      name: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true
      })
    })
  }

  protected create() {
    if (this.createForm.invalid)
      return

    this._test.createTest({
      name: this.createForm.controls.name.value,
      grade: +(this._route.snapshot.paramMap.get('id') ?? 0)
    })
      .subscribe(test => {
        this._router.navigate(['test', test.pk])
      })
  }
}