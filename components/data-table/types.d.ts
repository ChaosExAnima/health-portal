import React from 'react';

import type { TableCellProps } from '@material-ui/core/TableCell/TableCell';
import type { StringMap } from 'global-types';

type DataTableFilterBase< Key extends string > = {
	key: Key;
	label: string;
};

type DataTableFilterSelectValues = Map< string, string >;

type DataTableFilterSelect< Key extends string > = DataTableFilterBase< Key > & {
	type: 'select';
	values: DataTableFilterSelectValues;
	default?: string;
	noAll?: true;
};
type DataTableFilterDate< Key extends string > = DataTableFilterBase< Key > & {
	type: 'date',
	default?: string;
};

export type DataTableRowData = {
	slug: string;
	[ key: string ]: any;
};

export type DataTableFilter< Key = string > = DataTableFilterSelect< Key > | DataTableFilterDate< Key >;

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
