import { IBuildFormControl } from "./IBuildFormControl";
import { ValidatorFn } from "@angular/forms";

export interface IBuildForm {
  controls: IBuildFormControl<any>[]
  title: string
  submitText: string
  validators?: ValidatorFn[]
}
