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
import { StringMap } from 'global-types';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useForm, Controller, Control, FieldErrors } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import type { DataTableFilter } from './types';

type DataTableFiltersProps = {
	filters: DataTableFilter[];
	hasDates: boolean;
	schema?: yup.AnyObjectSchema;
};

type DataTableFiltersFieldProps = {
	control: Control;
	filter: DataTableFilter;
	error?: FieldErrors;
};

const useStyles = makeStyles( ( theme: Theme ) =>
	createStyles( {
		formControl: {
			margin: theme.spacing( 1 ),
			minWidth: 120,
			height: 80,
		},
		filterBar: {
			gap: theme.spacing( 2 ),
		},
	} )
);

const dateSchema = () => {
	const inFive = dayjs().add( 5, 'min' ).toDate();
	return yup.object( {
		start: yup.date().max( inFive, 'Date cannot be in the future' ),
		end: yup
			.date()
			.max( inFive, 'Date cannot be in the future' )
			.when( 'start', ( start, schema ) => {
				if ( start ) {
					return schema.min( start, 'End cannot be before start' );
				}
				return schema;
			} ),
	} );
};

export default function DataTableFilter( {
	filters,
	hasDates,
	schema,
}: DataTableFiltersProps ) {
	const classes = useStyles();

	if ( hasDates ) {
		if ( schema ) {
			schema = schema.concat( dateSchema() );
		} else {
			schema = dateSchema();
		}
		const today = dayjs();
		const monthStart = dayjs().startOf( 'month' );
		filters = [
			{
				key: 'start',
				type: 'date',
				default: monthStart.format( 'YYYY-MM-DD' ),
				label: 'Start Date',
			},
			{
				key: 'end',
				type: 'date',
				default: today.format( 'YYYY-MM-DD' ),
				label: 'End Date',
			},
			...filters,
		];
	}

	const defaultValues = Object.fromEntries(
		filters.map( ( { key, default: defaultValue } ) => [
			key,
			defaultValue || '',
		] )
	);
	const {
		watch,
		control,
		formState: { errors },
		trigger,
	} = useForm( {
		defaultValues,
		resolver: schema ? yupResolver( schema ) : schema,
	} );
	const router = useRouter();

	useEffect( () => {
		const subscription = watch( async ( formValues: StringMap ) => {
			if ( ! ( await trigger() ) ) {
				return;
			}
			const url = new URL( router.pathname, 'http://localhost:3000' );
			const params = new URLSearchParams( formValues );
			url.search = params.toString();
			router.push( url );
		} );
		return () => subscription.unsubscribe();
	}, [ watch ] );

	if ( filters.length === 0 ) {
		return null;
	}

	return (
		<Toolbar className={ classes.filterBar }>
			<Typography variant="h5" component="p">
				Filter
			</Typography>
			<FilterListIcon />
			{ filters.map( ( filter ) => (
				<DataTableFilterField
					key={ filter.key }
					control={ control }
					filter={ filter }
					error={ errors[ filter.key ] }
				/>
			) ) }
		</Toolbar>
	);
}

function DataTableFilterField( {
	control,
	filter,
	error,
}: DataTableFiltersFieldProps ) {
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
					error={ !! error }
					helperText={ error?.message }
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
