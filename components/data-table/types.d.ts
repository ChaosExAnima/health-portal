import type { TableCellProps } from '@material-ui/core/TableCell/TableCell';
import React from 'react';

type DataTableFilterBase = {
	key: string;
	label: string;
};

type DataTableFilterSelectValues = Record< string, string >;

type DataTableFilterSelect = DataTableFilterBase & {
	type: 'select';
	values: DataTableFilterSelectValues;
	default?: 'all' | keyof DataTableFilterSelectValues;
	noAll?: true;
};

export type DataTableFilter = DataTableFilterSelect;

export type DataTableRowLink = {
	slug: string;
	name: string | React.ReactNode;
};

export type DataTableRowData = {
	id: number;
	slug: string;
	[ column: string ]: ?React.ReactNode;
};

export type DataTableFormatter = ( arg0: unknown ) => string | React.ReactNode;

export type DataTableColumn = TableCellProps & {
	name: string;
	key: string;
	format?: 'currency' | DataTableFormatter;
	link?: boolean;
};
