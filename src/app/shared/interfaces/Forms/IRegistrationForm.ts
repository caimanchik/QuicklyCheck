import { ILoginForm } from "./ILoginForm";
import { FormControl } from "@angular/forms";

export interface IRegistrationForm extends ILoginForm {
  repeatPassword: FormControl<string>
  personal: FormControl<boolean>
}
