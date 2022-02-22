import React, { PropsWithChildren } from 'react';
import { Stack, Typography } from '@mui/material';

import { DetailProps } from './types';

export default function Detail( {
	label,
	placeholder = 'None',
	children,
}: PropsWithChildren< DetailProps > ) {
	return (
		<Stack direction="row">
			<Typography
				variant="body1"
				component="dt"
				minWidth="8em"
				color="grey.500"
			>
				{ label }
			</Typography>
			<Typography
				variant="body1"
				color={ children ? 'text.primary' : 'grey.700' }
				component="dd"
				fontStyle={ children ? 'normal' : 'oblique' }
			>
				{ children || placeholder }
			</Typography>
		</Stack>
	);
}
