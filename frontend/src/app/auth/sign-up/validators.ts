import { AbstractControl } from '@angular/forms';

export function comparePassword(password: string, confirmPassword: string) {
  return (control: AbstractControl) => {
    const passCtrl = control.get(password);
    const confirmCtrl = control.get(confirmPassword);

    if (!passCtrl || !confirmCtrl) {
      return null;
    }

    if (passCtrl.value !== confirmCtrl.value) {
      confirmCtrl.setErrors({ passwordsDoesNotMatch: true });
      return { passwordsDoesNotMatch: true };
    }

    confirmCtrl.setErrors(null);
    return null;
  };
}
