export enum FormValidationErorrs {
  required = 'This field is required.',
  invalidFileFormat = 'Invalid file extension',
  pattern = 'Invalid format, only numeric values are allowed.',
  minLength = 'Field must contain more than 3 characters.',
  emailFormat = 'Invalid format, example(test@gmail.com)',
}

export enum FormValidationErrorType {
  required = 'required',
  invalidExtension = 'invalidExtension',
  pattern = 'pattern',
  minlength = 'minlength',
  email = 'email'
}
