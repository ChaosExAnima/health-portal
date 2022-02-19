import { Chip } from '@mui/material';
import { without } from 'lodash';

import { FormTermFieldChipsProps } from '../types';

export default function FormTermFieldChips( {
	terms,
	setTerms,
	inputRef,
	...ChipProps
}: FormTermFieldChipsProps ) {
	const onDelete = ( term: string ) => () => {
		const newTerms = without( terms, term );
		setTerms( newTerms );
		inputRef?.current?.focus();
	};

	return (
		<>
			{ terms.map( ( term ) => (
				<Chip
					key={ term }
					{ ...ChipProps }
					sx={ ( theme ) => ( {
						maxWidth: `calc( 100% - ${ theme.spacing( 3 ) } )`,
					} ) }
					label={ term }
					onDelete={ onDelete( term ) }
				/>
			) ) }
		</>
	);
}
