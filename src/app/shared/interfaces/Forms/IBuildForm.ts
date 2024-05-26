import { IBuildFormControl } from "./IBuildFormControl";
import { ValidatorFn } from "@angular/forms";

export interface IBuildForm {
  controls: IBuildFormControl<any>[]
  validators?: ValidatorFn[]
}
