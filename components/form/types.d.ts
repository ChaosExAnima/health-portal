import { ReactElement, MutableRefObject } from 'react';
import { Control, UnpackNestedValue, UseFormRegister, Path } from 'react-hook-form';
import { Promisable } from 'type-fest';
import { StandardTextFieldProps as MuiTextFieldProps, ChipProps as MuiChipProps } from '@material-ui/core';

export { AnyObjectSchema as Schema } from 'yup';


export type Input = Record< string, any >;

export interface FormProps<Schema extends AnyObjectSchema> {
	schema: Schema;
	onSubmit: ( form: UnpackNestedValue<Schema> ) => Promisable<void>;
	children: ReactElement< FormBaseFieldProps<Schema> >[];
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
	name: string;
	label: string;
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
