import { AbstractControl } from '@angular/forms';

export function comparePassword(password: string, confirmPassword: string) {
  return (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      return null;
    }

    return { passwordsDoesNotMatch: true };
  };
}
