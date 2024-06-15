import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface IEditForm {
  answers: FormArray<FormControl<number>>
  variant: FormControl<number>
  id: FormGroup<IIdEditForm>
}

export interface IIdEditForm {
  idFirst: FormControl<number>
  idSecond: FormControl<number>
}
