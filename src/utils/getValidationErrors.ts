import { ValidationError } from 'yup';

interface Errors {
	// Means that the left side (key) can be anything
	[key: string]: string;
}

export default function getValidationErrors(error: ValidationError): Errors {
	const ValidationErrors: Errors = {};

	error.inner.forEach(error => {
		ValidationErrors[error.path] = error.message;
	});

	return ValidationErrors;
}
