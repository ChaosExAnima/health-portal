import { Box, Button } from '@mui/material';
import DateAdaptor from '@mui/lab/AdapterDayjs';
import React from 'react';
// eslint-disable-next-line import/named
import { AnyObjectSchema } from 'yup';

import { FormProps } from './types';
import { LocalizationProvider } from '@mui/lab';

export default function Form< Schema extends AnyObjectSchema >( {
	onSubmit,
	children,
}: FormProps< Schema > ) {
	return (
		<Box component="form" onSubmit={ onSubmit }>
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
