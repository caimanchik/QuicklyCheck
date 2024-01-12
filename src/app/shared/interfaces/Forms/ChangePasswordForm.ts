import { FormControl } from "@angular/forms";

export interface ChangePasswordForm {
  old: FormControl<string>
  new: FormControl<string>
  newRepeat: FormControl<string>
}
