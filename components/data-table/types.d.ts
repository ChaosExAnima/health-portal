import React from 'react';
import type { TableCellProps } from '@material-ui/core/TableCell/TableCell';

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

export type DataTableRowData = {
	slug: string;
	[ key: string ]: any;
};

export type DataTableFilter = DataTableFilterSelect;

export type DataTableRowLink = {
	slug: string;
	name: string | React.ReactNode;
};

export type DataTableFormatter = ( arg0: unknown ) => React.ReactNode;

export type DataTableColumn< Key extends keyof DataTableRowData > = TableCellProps & {
	name: string;
	key: Key;
	format?: DataTableFormatter;
	link?: boolean;
	linkPrefix?: string;
};
