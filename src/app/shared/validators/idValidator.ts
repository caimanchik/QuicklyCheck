import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function idValidator(error: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const idFirst = +control.get('idFirst')?.value
    const idSecond = +control.get('idSecond')?.value

    return idFirst + idSecond === 0
      ? { error }
      : null;
  }
}
