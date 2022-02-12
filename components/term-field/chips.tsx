import { Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { without } from 'lodash';
import { TermFieldChipsProps } from './types';

const PREFIX = 'chips';

const classes = {
	chip: `${ PREFIX }-chip`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled( 'div' )( () => ( {
	[ `& .${ classes.chip }` ]: {
		margin: 3,
		maxWidth: 'calc( 100% - 6px)',
	},
} ) );

export default function TermFieldChips( {
	terms,
	setTerms,
	inputRef,
	...ChipProps
}: TermFieldChipsProps ) {
	const onDelete = ( term: string ) => () => {
		const newTerms = without( terms, term );
		setTerms( newTerms );
		inputRef?.current?.focus();
	};

	return (
		<Root>
			{ terms.map( ( term ) => (
				<Chip
					key={ term }
					{ ...ChipProps }
					className={ classes.chip }
					label={ term }
					onDelete={ onDelete( term ) }
				/>
			) ) }
		</Root>
	);
}
