import {
	createStyles,
	FormControl,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
	TextField,
	Theme,
	Toolbar,
	Typography,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import dayjs from 'dayjs';
import React from 'react';

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
	const filterComponents: React.ReactNode[] = [];

	if ( hasDates ) {
		const today = dayjs();
		const monthStart = dayjs().startOf( 'month' );

		filterComponents.push(
			<TextField
				id="range-start"
				key="date-range-start"
				label="Service Start Date"
				type="date"
				defaultValue={ monthStart.format( 'YYYY-MM-DD' ) }
				className={ classes.formControl }
				InputLabelProps={ {
					shrink: true,
				} }
			/>,
			<TextField
				id="range-end"
				key="date-range-end"
				label="Service Start Date"
				type="date"
				defaultValue={ today.format( 'YYYY-MM-DD' ) }
				className={ classes.formControl }
				InputLabelProps={ {
					shrink: true,
				} }
			/>
		);
	}

	for ( const filter of filters ) {
		if ( filter.type === 'select' ) {
			const values =
				filter.values instanceof Map
					? filter.values
					: new Map( Object.entries( filter.values ) );
			filterComponents.push(
				<FormControl
					className={ classes.formControl }
					key={ filter.key }
				>
					<InputLabel id={ `${ filter.key }-label` }>
						{ filter.label }
					</InputLabel>
					<Select
						labelId={ `${ filter.key }-label` }
						autoWidth
						defaultValue={ filter.default || 'all' }
					>
						{ ! filter.noAll && (
							<MenuItem value="all">All</MenuItem>
						) }
						{ Array.from( values, ( [ key, value ] ) => (
							<MenuItem value={ key } key={ key }>
								{ value }
							</MenuItem>
						) ) }
					</Select>
				</FormControl>
			);
		}
	}

	if ( filters.length === 0 ) {
		return null;
	}

	return (
		<Toolbar className={ classes.filterBar }>
			<Typography variant="h5" component="p">
				Filter
			</Typography>
			<FilterListIcon />
			{ filterComponents }
		</Toolbar>
	);
}
