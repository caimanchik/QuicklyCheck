import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { IBuildForm } from "../../interfaces/Forms/IBuildForm";
import { DestroyService } from "../../services/infrastructure/destroy.service";
import { FormArray, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class FormComponent implements OnInit {
  @Input() public buildForm!: IBuildForm

  protected error!: string | null
  protected formGroup!: FormGroup<{controls: FormArray}>

  constructor(
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.formGroup = new FormGroup({
      controls: new FormArray(this.buildForm.controls.map(buildControl => buildControl.control))
    })

    this.formGroup.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(() => {
        let found = false

        this.formGroup.controls.controls.controls.forEach(formControl => {
          if (found || formControl.valid)
            return

          this.error = formControl.errors?.['error']
          found = true
        })

        if (!found)
          this.error = null

        this._cd.detectChanges()
      })
  }
}
