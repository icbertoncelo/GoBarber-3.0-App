import { ValidationError } from 'yup';

interface ErrorObject {
  [key: string]: string;
}

export default function getValidationErrors(
  errorParam: ValidationError,
): ErrorObject {
  const validationErrors: ErrorObject = {};

  errorParam.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
