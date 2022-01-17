import React, { useMemo } from 'react';
import { TableCell, TableRow } from '@material-ui/core';
import { get } from 'lodash';

import OptionalLink from 'components/optional-link';
import { DataTableColumn, DataTableRowData } from './types';

type DataTableRowProps< Data > = {
	rowData: Data;
	columns: DataTableColumn< Extract< keyof Data, string > >[];
	basePath?: string;
};

type DataTableCellProps< Data > = DataTableColumn<
	Extract< keyof Data, string >
> & {
	value: React.ReactNode;
	slug?: string;
	basePath?: string;
};

function DataTableCell< Data >(
	props: DataTableCellProps< Data >
): JSX.Element {
	const { value, link, slug, format, basePath = '', ...cellProps } = props;
	let text = value;
	if ( typeof format === 'function' ) {
		text = format( value );
	} else if ( typeof format === 'string' && typeof value !== 'string' ) {
		text = get( value, format, '' );
	}
	return (
		<TableCell { ...cellProps }>
			<OptionalLink
				href={ link ? `${ basePath }/${ slug }` : '' }
				color="inherit"
			>
				{ text }
			</OptionalLink>
		</TableCell>
	);
}

export default function DataTableRow< Data extends DataTableRowData >(
	props: DataTableRowProps< Data >
): JSX.Element {
	const { columns, rowData, basePath } = props;
	const cells: DataTableCellProps< Data >[] = useMemo( () => {
		return columns.map( ( column ) => ( {
			...column,
			value: rowData[ column.key ],
			slug: ( column.linkPrefix || '' ) + rowData.slug,
			basePath,
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
