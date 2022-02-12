import { ChipProps, TextFieldProps } from '@mui/material';
import { MutableRefObject } from 'react';
import { Control } from 'react-hook-form';

type TermFieldProps = TextFieldProps & {
	name: string;
	label: string;
	control: Control< any >;
	required?: boolean;
	unique?: boolean;
	format?: ( term: string ) => string | null;
};

type TermFieldChipsProps = ChipProps & {
	terms: string[];
	setTerms: ( arg0: string[] ) => void;
	inputRef?: MutableRefObject< HTMLInputElement | null >;
};
