import { FormControl } from "@angular/forms";

export interface IChangePasswordForm {
  oldPassword: FormControl<string>
  password: FormControl<string>
  repeatPassword: FormControl<string>
}
