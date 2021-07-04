import React, { useMemo } from 'react';
import { TableCell, TableRow } from '@material-ui/core';

import OptionalLink from 'components/optional-link';

import { DataTableColumn, DataTableRowData } from './types';

type DataTableRowProps< Data > = {
	rowData: Data;
	columns: DataTableColumn< Extract< keyof Data, string > >[];
};

type DataTableCellProps< Data > = DataTableColumn<
	Extract< keyof Data, string >
> & {
	value: React.ReactNode;
	slug?: string;
};

function DataTableCell< Data >(
	props: DataTableCellProps< Data >
): JSX.Element {
	const { value, link, slug, format } = props;
	let text = value;
	if ( typeof format === 'function' ) {
		text = format( value );
	}
	return (
		<TableCell { ...props }>
			<OptionalLink href={ link ? slug : '' } color="inherit">
				{ text }
			</OptionalLink>
		</TableCell>
	);
}

export default function DataTableRow< Data extends DataTableRowData >(
	props: DataTableRowProps< Data >
): JSX.Element {
	const { columns, rowData } = props;
	const cells: DataTableCellProps< Data >[] = useMemo( () => {
		return columns.map( ( column ) => ( {
			...column,
			value: rowData[ column.key ],
			slug: rowData.slug,
		} ) );
	}, [ rowData, columns ] );

	return (
		<TableRow>
			{ cells.map( ( cell ) => (
				<DataTableCell< Data > { ...cell } key={ cell.key } />
			) ) }
		</TableRow>
	);
}
