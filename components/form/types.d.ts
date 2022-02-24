import { MutableRefObject, ReactNode } from 'react';
import {
	Control,
	UnpackNestedValue,
	UseFormRegister,
	Path,
	UseFormReturn,
	UseFormHandleSubmit,
	FieldValues,
} from 'react-hook-form';
import { Promisable } from 'type-fest';
import { AnyObjectSchema, InferType } from 'yup';
import {
	StandardTextFieldProps as MuiTextFieldProps,
	ChipProps as MuiChipProps,
} from '@mui/material';
import {
	DatePickerProps as MuiDatePickerProps,
	TimePickerProps as MuiTimePickerProps,
	DateTimePickerProps as MuiDateTimePickerProps,
} from '@mui/lab';

import type { API_ENTITY_TYPE } from 'lib/constants';

export type Input = Record< string, any >;

export interface FormProps< Schema extends AnyObjectSchema > {
	handleSubmit: UseFormHandleSubmit< FieldValues >;
	type: API_ENTITY_TYPE;
	new?: boolean;
	name?: string;
	transform?: ( form: any ) => any;
	children: ReactNode;
}

export interface FormBaseFieldProps< Schema extends Input > {
	name: Path< Schema >;
	label: string;
	control: Control< Schema >;
	required?: boolean;
}
export interface FormTextFieldProps< Schema >
	extends FormBaseFieldProps< Schema >,
		MuiTextFieldProps {}

// Autocomplete
export interface FormAutocompleteFieldProps< Schema >
	extends FormBaseFieldProps< Schema > {
	target?: string;
	targetKey?: string;
	multiple?: boolean;
	free?: boolean;
}

export interface AutocompleteOption {
	id: number;
	label: string;
}
export interface AutocompleteOptionNew extends AutocompleteOption {
	id: 0;
	value: string;
}
export type AutocompleteOptions = AutocompleteOption | AutocompleteOptionNew;
export interface AutocompleteResponseError {
	success: false;
	errors: string[];
}
export interface AutocompleteResponseSuccess {
	success: true;
	options: AutocompleteOption[];
}
export type AutocompleteResponse =
	| AutocompleteResponseError
	| AutocompleteResponseSuccess;

// Terms
export interface FormTermFieldProps< Schema >
	extends FormBaseFieldProps< Schema >,
		MuiTextFieldProps {
	unique?: boolean;
	format?: ( term: string ) => string | null;
}
export interface FormTermFieldChipsProps extends MuiChipProps {
	terms: string[];
	setTerms: ( arg0: string[] ) => void;
	inputRef?: MutableRefObject< HTMLInputElement | null >;
}

// Date/time picker
type WithoutFormValues< I > = Omit< I, 'value' | 'onChange' | 'renderInput' >;
export interface FormDateFieldProps< S >
	extends FormBaseFieldProps< S >,
		WithoutFormValues< MuiDatePickerProps > {}
export interface FormTimeFieldProps< S >
	extends FormBaseFieldProps< S >,
		WithoutFormValues< MuiTimePickerProps > {}
export interface FormDateTimeFieldProps< S >
	extends FormBaseFieldProps< S >,
		WithoutFormValues< MuiDateTimePickerProps > {}
