import { FormControl } from "@angular/forms";

export interface IChangePasswordForm {
  old: FormControl<string>
  new: FormControl<string>
  newRepeat: FormControl<string>
}
