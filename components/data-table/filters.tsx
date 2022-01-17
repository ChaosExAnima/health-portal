import {
	createStyles,
	makeStyles,
	MenuItem,
	TextField,
	Theme,
	Toolbar,
	Typography,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import dayjs from 'dayjs';
import React from 'react';
import { useForm, Controller, Control } from 'react-hook-form';

import type { DataTableFilter } from './types';

type DataTableFiltersProps = {
	filters: DataTableFilter[];
	hasDates: boolean;
};

const useStyles = makeStyles( ( theme: Theme ) =>
	createStyles( {
		formControl: {
			margin: theme.spacing( 1 ),
			minWidth: 120,
		},
		filterBar: {
			gap: theme.spacing( 2 ),
		},
	} )
);

export default function DataTableFilter( {
	filters,
	hasDates,
}: DataTableFiltersProps ) {
	const classes = useStyles();

	const defaultValues = Object.fromEntries(
		filters.map( ( { key, default: defaultValue } ) => [
			key,
			defaultValue || '',
		] )
	);
	if ( hasDates ) {
		const today = dayjs();
		const monthStart = dayjs().startOf( 'month' );
		filters = [
			{
				key: 'data-range-start',
				type: 'date',
				default: monthStart.format( 'YYYY-MM-DD' ),
				label: 'Start Date',
			},
			{
				key: 'data-range-end',
				type: 'date',
				default: today.format( 'YYYY-MM-DD' ),
				label: 'End Date',
			},
			...filters,
		];
	}

	const { handleSubmit, control } = useForm( { defaultValues } );

	if ( filters.length === 0 ) {
		return null;
	}

	return (
		<Toolbar className={ classes.filterBar }>
			<Typography variant="h5" component="p">
				Filter
			</Typography>
			<FilterListIcon />
			<form
				noValidate
				autoComplete="off"
				onSubmit={ handleSubmit( console.log ) }
			>
				{ filters.map( ( filter ) => (
					<DataTableFilterField
						key={ filter.key }
						control={ control }
						filter={ filter }
					/>
				) ) }
			</form>
		</Toolbar>
	);
}

function DataTableFilterField( {
	control,
	filter,
}: {
	control: Control;
	filter: DataTableFilter;
} ) {
	const { formControl } = useStyles();
	const { type } = filter;
	return (
		<Controller
			name={ filter.key }
			control={ control }
			render={ ( { field } ) => (
				<TextField
					{ ...field }
					type={ type }
					label={ filter.label }
					className={ formControl }
					InputLabelProps={ {
						shrink: type === 'date' || undefined,
					} }
					select={ type === 'select' }
				>
					{ type === 'select' && ! filter.noAll && (
						<MenuItem value="all">All</MenuItem>
					) }
					{ type === 'select' &&
						Array.from(
							filter.values.entries(),
							( [ key, value ] ) => (
								<MenuItem value={ key } key={ key }>
									{ value }
								</MenuItem>
							)
						) }
				</TextField>
			) }
		/>
	);
}
