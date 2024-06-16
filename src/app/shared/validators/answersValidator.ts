import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function answersValidator(): ValidatorFn {
  return function(control: AbstractControl): ValidationErrors | null {
    // @ts-ignore
    const answers = (control.controls ?? []) as FormControl<any>[]

    return answers
      .map(control => control.errors)
      .filter(error => error)
      [0]
  }
}
