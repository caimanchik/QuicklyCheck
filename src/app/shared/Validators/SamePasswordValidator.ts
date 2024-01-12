import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ChangePasswordForm } from "../interfaces/Forms/ChangePasswordForm";

export const samePasswordValidator: ValidatorFn = (
  control: AbstractControl<ChangePasswordForm>
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

