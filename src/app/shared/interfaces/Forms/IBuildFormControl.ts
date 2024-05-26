import { FormControl } from "@angular/forms";

export interface IBuildFormControl<T> {
  control: FormControl<T>
  type: string
  placeholder: string
}
