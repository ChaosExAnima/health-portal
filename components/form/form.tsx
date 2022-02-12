import { Box, Button } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import dayjs from 'dayjs';
import React from 'react';
import { AnyObjectSchema } from 'yup';

import { FormProps } from './types';

export default function Form< Schema extends AnyObjectSchema >( {
	onSubmit,
	children,
}: FormProps< Schema > ) {
	return (
		<Box component="form" onSubmit={ onSubmit }>
			<MuiPickersUtilsProvider utils={ dayjs }>
				{ children }
			</MuiPickersUtilsProvider>
			<Box mt={ 2 }>
				<Button type="submit" color="primary">
					Submit
				</Button>
			</Box>
		</Box>
	);
}
