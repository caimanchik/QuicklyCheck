import { FormControl } from "@angular/forms";

export interface CreateClassForm {
  number: FormControl<string>
  letter: FormControl<string>
}
