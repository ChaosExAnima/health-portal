import React, { useContext } from 'react';
import {
	Grid,
	TextField,
	Typography,
} from '@material-ui/core';

import { DetailsContext } from './index';
import { onChangeFunc } from 'global-types';

type DetailCommonProps = {
	name: string;
	empty?: string;
	type?: 'tel' | 'email' | 'url';
};

type DetailProps = DetailCommonProps & (
	| { onChange: onChangeFunc; id?: never }
	| { onChange?: never; id: string }
);

const DetailText: React.FC< Omit<DetailProps, 'name'> > = ( {
	children,
	empty = 'Unknown',
	type = 'text',
	id,
	onChange: onChangeProp,
} ) => {
	const { edit, onChange: onChangeRoot } = useContext( DetailsContext );
	if ( ! edit ) {
		return (
			<Typography variant="body1" color={ status ? 'textPrimary' : 'textSecondary' }>
				{ children || empty }
			</Typography>
		);
	}

	const onChange = ( value: string ) => {
		if ( onChangeProp ) {
			return onChangeProp( value );
		} else if ( onChangeRoot && id ) {
			return onChangeRoot( id, value );
		}
		throw new Error( 'Provide onChange method.' );
	};
	return (
		<TextField
			placeholder={ empty }
			value={ children || '' }
			type={ type || 'text' }
			onChange={ ( event ) => onChange( event.target.value ) }
			fullWidth
		/>
	);
};

const Detail: React.FC<DetailProps> = ( { name, ...props } ) => (
	<Grid container item>
		<Grid item md={ 2 }>
			<Typography variant="body1">
				{ name }
			</Typography>
		</Grid>
		<Grid item md={ 10 }>
			<DetailText { ...props } />
		</Grid>
	</Grid>
);

export default Detail;
