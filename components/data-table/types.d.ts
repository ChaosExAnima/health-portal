import type { TableCellProps } from '@material-ui/core/TableCell/TableCell';

type DataTableFilterBase = {
	key: string;
	label: string;
};

type DataTableFilterSelectValues = Record<string, string>;

type DataTableFilterSelect = DataTableFilterBase & {
	type: 'select';
	values: DataTableFilterSelectValues;
	default?: 'all' | keyof DataTableFilterSelectValues;
	noAll?: true;
};

export type DataTableFilter = DataTableFilterSelect;

export type DataTableRowLink = {
	__typename: string;
	slug: string;
	name: string | React.ReactNode;
};

export type DataTableRowData = {
	__typename?: string;
	id: number;
	slug: string;
	[ key: string ]: React.ReactNode;
}

// eslint-disable-next-line no-unused-vars
export type DataTableFormatter = ( arg0: unknown ) => string | React.ReactNode;

export type DataTableColumn = TableCellProps & {
	name: string;
	key: string;
	format?: 'currency' | DataTableFormatter;
	link?: boolean;
}
