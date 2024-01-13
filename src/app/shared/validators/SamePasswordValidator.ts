import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { IChangePasswordForm } from "../interfaces/Forms/IChangePasswordForm";

export const samePasswordValidator: ValidatorFn = (
  control: AbstractControl<IChangePasswordForm>
): ValidationErrors | null => {
    const newPass = control.get('new')?.value;
    const newRepeat = control.get('new')?.value;

    if (!(newPass && newRepeat))
      return {
        notSame: true
      }

    if (newPass === newRepeat)
      return null

    return {
      notSame: true
    }
  }

