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

type DataTableRowData = {
	slug: string;
	[ key: string ]: any;
};

type DataTableFilter< Key = string > = DataTableFilterSelect< Key > | DataTableFilterDate< Key >;

type DataTableRowLink = {
	slug: string;
	name: string | React.ReactNode;
};

type DataTableFormatter = ( arg0: unknown ) => React.ReactNode;

type DataTableColumn< Key extends keyof DataTableRowData > = TableCellProps & {
	name: string;
	key: Key;
	format?: DataTableFormatter | string;
	link?: boolean;
	linkPrefix?: string;
};
