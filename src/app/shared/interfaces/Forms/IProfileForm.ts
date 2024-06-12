import { FormControl } from "@angular/forms";

export interface IProfileForm {
  name: FormControl<string>
  surname: FormControl<string>
  patronymic: FormControl<string>
}
