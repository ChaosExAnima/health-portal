import { TextField as MuiTextField } from '@material-ui/core';
import {
	DatePicker,
	DateTimePicker,
	TimePicker,
	TimePickerProps,
} from '@material-ui/pickers';
import { useController } from 'react-hook-form';
import { FormDateTimeAnyFieldProps, FormTextFieldProps, Input } from './types';

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
			fullWidth
		/>
	);
}

export function FormDateTimeField< S extends Input >( {
	control,
	name,
	type = 'date',
	...rawProps
}: FormDateTimeAnyFieldProps< S > ) {
	const {
		field,
		fieldState: { error },
	} = useController( { name, control } );

	let PickerComponent;
	let fieldProps;
	if ( type === 'time' ) {
		PickerComponent = TimePicker;
	} else if ( type === 'datetime' ) {
		PickerComponent = DateTimePicker;
	} else {
		PickerComponent = DatePicker;
	}

	let errorText = ' ';
	if ( error ) {
		errorText = error.message ?? errorText;
	}
	return (
		<PickerComponent
			{ ...field }
			helperText={ errorText }
			error={ !! error }
		/>
	);
}
