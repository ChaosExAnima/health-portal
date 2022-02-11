import { TextField as MuiTextField } from '@material-ui/core';
import { useController } from 'react-hook-form';
import { FormTextFieldProps, Input } from './types';

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
