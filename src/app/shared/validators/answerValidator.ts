import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function answerValidator(error: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = +control.value

    return (isNaN(value) && !['X', 'x', 'Х', 'х'].includes(control.value))
            || value <= 0
            || value > 5
      ? { error }
      : null;
  }
}
