import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function classNumberValidator(errorMessage: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = parseInt(control.value)

    return value && value > 0 && value < 12 && /^\d+$/.test(value.toString())
      ? null
      : { error: errorMessage }
  }
}
