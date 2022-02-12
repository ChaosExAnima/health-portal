import { ReactElement, MutableRefObject } from 'react';
import { Control, UnpackNestedValue, UseFormRegister, Path, UseFormReturn, UseFormHandleSubmit } from 'react-hook-form';
import { Promisable } from 'type-fest';
import { StandardTextFieldProps as MuiTextFieldProps, ChipProps as MuiChipProps } from '@mui/material';
import {
	DatePickerProps as MuiDatePickerProps,
	TimePickerProps as MuiTimePickerProps,
	DateTimePickerProps as MuiDateTimePickerProps,
} from '@mui/lab';

import { NewTypes } from 'lib/api/types';

export { AnyObjectSchema as Schema } from 'yup';


export type Input = Record< string, any >;

export interface FormProps<Schema extends AnyObjectSchema> {
	handleSubmit: UseFormHandleSubmit;
	type: NewTypes;
	new?: boolean;
	children: ReactElement[];
}

export interface FormBaseFieldProps<Schema extends Input> {
	name: Path<Schema>;
	label: string;
	control: Control< Schema >;
	required?: boolean;
}
export interface FormTextFieldProps<Schema> extends FormBaseFieldProps<Schema>, MuiTextFieldProps {}

// Autocomplete
export interface FormAutocompleteFieldProps<Schema> extends FormBaseFieldProps<Schema> {
	target?: string;
	multiple?: boolean;
	free?: boolean;
}

export interface AutocompleteOptionDB {
	id: number;
	label: string;
}
export interface AutocompleteOptionNew {
	id: 0;
	label: string;
	input: string;
}
export type AutocompleteOption = AutocompleteOptionDB | AutocompleteOptionNew;

export interface AutocompleteResponseError {
	success: false;
	errors: string[];
}
export interface AutocompleteResponseSuccess {
	success: true;
	options: AutocompleteOption[];
}
export type AutocompleteResponse = AutocompleteResponseError | AutocompleteResponseSuccess;

// Terms
export interface FormTermFieldProps<Schema> extends FormBaseFieldProps<Schema>, MuiTextFieldProps {
	unique?: boolean;
	format?: ( term: string ) => string | null;
}
export interface FormTermFieldChipsProps extends MuiChipProps {
	terms: string[];
	setTerms: ( arg0: string[] ) => void;
	inputRef?: MutableRefObject< HTMLInputElement | null >;
}

// Date/time picker
type WithoutFormValues<I> = Omit<I, 'value' | 'onChange' | 'renderInput'>;
export interface FormDateFieldProps<S> extends FormBaseFieldProps<S>, WithoutFormValues<MuiDatePickerProps> {
	type?: 'date';
}
export interface FormTimeFieldProps<S> extends FormBaseFieldProps<S>, WithoutFormValues<MuiTimePickerProps> {
	type: 'time';
}
export interface FormDateTimeFieldProps<S> extends FormBaseFieldProps<S>, WithoutFormValues<MuiDateTimePickerProps> {
	type: 'datetime';
}
export type FormDateTimeAnyFieldProps<S> = FormDateFieldProps<S> | FormTimeFieldProps<S> | FormDateTimeFieldProps<S>;
