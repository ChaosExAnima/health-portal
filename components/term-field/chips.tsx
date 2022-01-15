import { Chip, createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { without } from 'lodash';
import { TermFieldChipsProps } from './types';

const useStyles = makeStyles( () =>
	createStyles( {
		chip: {
			margin: 3,
			maxWidth: 'calc( 100% - 6px)',
		},
	} )
);

export default function TermFieldChips( {
	terms,
	setTerms,
	inputRef,
	...ChipProps
}: TermFieldChipsProps ) {
	const classes = useStyles();
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
					className={ classes.chip }
					label={ term }
					onDelete={ onDelete( term ) }
				/>
			) ) }
			&nbsp;
		</>
	);
}
