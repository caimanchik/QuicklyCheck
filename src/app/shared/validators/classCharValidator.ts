import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function classCharValidator(errorMessage: string): ValidatorFn {
  return (control: AbstractControl) : ValidationErrors | null => {
    const value = control.value

    return value.length === 1 && /^[а-яё]*$/i.test(value)
      ? null
      : { error: errorMessage }
  }
}
