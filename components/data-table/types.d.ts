import React from 'react';
import { TableCellProps } from '@material-ui/core/TableCell/TableCell';

import { StringMap } from 'global-types';

type DataTableFilterBase = {
	key: string;
	label: string;
};

type DataTableFilterSelectValues = StringMap | Map< string, string >;

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
	format?: DataTableFormatter | string;
	link?: boolean;
	linkPrefix?: string;
};
