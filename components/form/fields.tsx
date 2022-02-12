import { TextField as MuiTextField, TextField } from '@mui/material';
import {
	DatePicker,
	DateTimePicker,
	TimePicker,
	TimePickerProps,
} from '@mui/lab';
import { useController } from 'react-hook-form';
import { omit } from 'lodash';

import type {
	FormDateTimeFieldProps,
	FormTextFieldProps,
	Input,
} from './types';

export function FormTextField< Schema extends Input >( {
	name,
	label,
	control,
	...fieldProps
}: FormTextFieldProps< Schema > ) {
	const {
		field,
		fieldState: { error },
	} = useController( { name, control } );

	let errorText = ' ';
	if ( error ) {
		errorText = error.message ?? errorText;
	}
	return (
		<MuiTextField
			{ ...field }
			{ ...fieldProps }
			helperText={ errorText }
			error={ !! error }
			label={ label }
		/>
	);
}

export function FormDateTimeField< S extends Input >( {
	control,
	name,
	label,
	...fieldProps
}: FormDateTimeFieldProps< S > ) {
	const {
		field,
		fieldState: { error },
	} = useController( { name, control } );

	let errorText = ' ';
	if ( error ) {
		errorText = error.message ?? errorText;
	}
	return (
		<DateTimePicker
			{ ...field }
			{ ...fieldProps }
			label={ label }
			renderInput={ ( params ) => (
				<TextField
					{ ...params }
					helperText={ errorText }
					error={ !! error }
				/>
			) }
		/>
	);
}