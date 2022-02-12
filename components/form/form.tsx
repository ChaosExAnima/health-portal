import { Box, Button } from '@mui/material';
import DateAdaptor from '@mui/lab/AdapterDayjs';
import { LocalizationProvider } from '@mui/lab';
import React, { useState } from 'react';
// eslint-disable-next-line import/named
import { AnyObjectSchema } from 'yup';

import ErrorNotice from 'components/error-notice';
import { formatErrors, handleNewType } from 'lib/api/new';
import { ErrorHandler } from 'lib/api/types';

import type { FormProps } from './types';
import { useRouter } from 'next/router';

export default function Form< Schema extends AnyObjectSchema >( {
	type,
	new: newSubmission,
	children,
	handleSubmit,
}: FormProps< Schema > ) {
	const [ errors, setErrors ] = useState< string[] >( [] );
	const router = useRouter();

	const handleErrors: ErrorHandler = ( errs ) =>
		setErrors( formatErrors( errs ) );

	const onSubmit = handleSubmit( ( form: unknown ) => {
		if ( newSubmission ) {
			return handleNewType( form, type, handleErrors, router );
		}
	} );
	return (
		<Box component="form" onSubmit={ onSubmit } noValidate>
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
