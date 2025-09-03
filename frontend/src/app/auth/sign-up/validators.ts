import { AbstractControl, FormArray } from '@angular/forms';

export function comparePassword(group: AbstractControl) {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { passwordsDoesNotMatch: true }
    : null;
}

export function minQuestionsValidator(control: AbstractControl) {
  const value = control.value;
  if (value >= 5) {
    return null;
  }
  return { minQuestions: true };
}

export function atLeastOneSelected(control: AbstractControl) {
  const formArray = control as FormArray;
  const hasSelection = formArray.controls.some((ctrl) => ctrl.value === true);
  return hasSelection ? null : { atLeastOneRequired: true };
}
