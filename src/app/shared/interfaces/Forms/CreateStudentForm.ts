import { FormControl } from "@angular/forms";

export interface CreateStudentForm {
  surname: FormControl<string>
  name: FormControl<string>
  batya: FormControl<string>
}
