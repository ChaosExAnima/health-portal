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
		filterHeader: {
			marginRight: theme.spacing( 6 ),
		},
	} )
);

const DataTableFilters: React.FC< DataTableFiltersProps > = ( {
	filters,
	hasDates,
} ) => {
	const classes = useStyles();
	const filterComponents: React.ReactNode[] = [];

	if ( hasDates ) {
		const today = dayjs();
		const monthStart = dayjs().startOf( 'month' );

		filterComponents.push(
			<TextField
				id="range-start"
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
			filterComponents.push(
				<FormControl className={ classes.formControl }>
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
						{ Object.entries( filter.values ).map(
							( [ key, value ] ) => (
								<MenuItem value={ key } key={ key }>
									{ value }
								</MenuItem>
							)
						) }
					</Select>
				</FormControl>
			);
		}
	}

	if ( filters.length === 0 ) {
		return null;
	}

	return (
		<Toolbar>
			<Typography
				variant="h5"
				component="p"
				className={ classes.filterHeader }
			>
				Filter
				<FilterListIcon />
			</Typography>
			{ filterComponents }
		</Toolbar>
	);
};

export default DataTableFilters;
