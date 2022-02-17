import { Box, Button } from '@mui/material';
import DateAdaptor from '@mui/lab/AdapterDayjs';
import { LocalizationProvider } from '@mui/lab';
import React, { useState } from 'react';

import ErrorNotice from 'components/error-notice';
import { formatErrors, handleNewType } from 'lib/api/new';

import type { AnyObjectSchema } from 'yup';
import type { ErrorHandler } from 'lib/api/types';
import type { FormProps } from './types';

export default function Form< Schema extends AnyObjectSchema >( {
	type,
	name = type,
	new: newSubmission,
	children,
	handleSubmit,
	transform,
}: FormProps< Schema > ) {
	const [ errors, setErrors ] = useState< string[] >( [] );

	if ( newSubmission ) {
		name = `new-${ type }`;
	}

	const handleErrors: ErrorHandler = ( errs ) =>
		setErrors( formatErrors( errs ) );

	const onSubmit = handleSubmit( ( form: unknown ) => {
		if ( transform ) {
			form = transform( form );
		}
		if ( newSubmission ) {
			return handleNewType( form, type, handleErrors );
		}
	} );
	return (
		<Box
			noValidate
			name={ name }
			component="form"
			autoComplete="off"
			onSubmit={ onSubmit }
		>
			<ErrorNotice errors={ errors } />
			<LocalizationProvider dateAdapter={ DateAdaptor }>
				{ children }
			</LocalizationProvider>
			<Box mt={ 2 }>
				<Button type="submit" color="primary">
					Submit
				</Button>
			</Box>
		</Box>
	);
}
