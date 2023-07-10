import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from "@angular/forms";
import { FormValidationErorrs, FormValidationErrorType } from "../../enums/formValidationErorrs";
import { ALLOWED_EXTENSIONS } from "../../consts/consts";

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  constructor() { }

  public isInvalid(controlName: string, form: FormGroup): boolean {
    const control = form.get(controlName);

    return control !== null && control.invalid && (control.dirty || control.touched);
  }

  public getErrorMessage(controlName: string, form: FormGroup): string {
    console.log(controlName)
    const control = form.get(controlName);
    const errors = control?.errors;

    if (!errors) {
      return '';
    }

    switch (true) {
      case !!errors[FormValidationErrorType.required]:
        return FormValidationErorrs.required;
      case !!errors[FormValidationErrorType.invalidExtension]:
        return FormValidationErorrs.invalidFileFormat;
      case !!errors[FormValidationErrorType.pattern] && controlName === 'price':
        return FormValidationErorrs.pattern
      case !!errors[FormValidationErrorType.minlength]:
        return FormValidationErorrs.minLength;
      case !!errors[FormValidationErrorType.email]:
        return FormValidationErorrs.emailFormat;
      default:
        return '';
    }
  }

  public fileExtension() {
    return (control: AbstractControl) => {
      const file = control.value;
      if (file) {
        const extension = file.split('.').pop().toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
          return { invalidExtension: true };
        }
      }
      return null;
    };
  }
}
