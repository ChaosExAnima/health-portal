import React, { useMemo } from 'react';
import { TableCell, TableRow } from '@material-ui/core';

import OptionalLink from 'components/optional-link';
import { toInt } from 'lib/casting';
import numberFormat from 'lib/number-format';

import { DataTableColumn, DataTableRowData } from './types';
import Link from 'components/link';
import { isLinkObject } from './utils';

type DataTableRowProps = {
	rowData: DataTableRowData;
	columns: DataTableColumn[];
};

type DataTableCellProps = DataTableColumn & {
	value: React.ReactNode | number | string | Record< string, unknown >;
	slug?: string;
};

const DataTableCell: React.FC< DataTableCellProps > = ( {
	value,
	link,
	slug,
	format,
	...props
} ) => {
	let text = value;
	if ( value && format && ! React.isValidElement( value ) ) {
		if ( format === 'currency' ) {
			text = numberFormat( toInt( value ), true );
		} else if ( typeof format === 'function' ) {
			text = format( value );
		}
	}
	if (
		! React.isValidElement( value ) &&
		typeof value === 'object' &&
		value
	) {
		if ( isLinkObject( value ) ) {
			text = (
				<Link color="inherit" href={ value.slug }>
					{ value.name }
				</Link>
			);
		}
	}
	return (
		<TableCell { ...props }>
			<OptionalLink href={ link ? slug : '' } color="inherit">
				{ text }
			</OptionalLink>
		</TableCell>
	);
};

const DataTableRow: React.FC< DataTableRowProps > = ( {
	rowData,
	columns,
} ) => {
	const cells: DataTableCellProps[] = useMemo( () => {
		return columns.map( ( column ) => ( {
			...column,
			value: rowData[ column.key ],
			slug: rowData.slug,
		} ) );
	}, [ rowData, columns ] );

	return (
		<TableRow>
			{ cells.map( ( cell ) => (
				<DataTableCell { ...cell } key={ cell.key } />
			) ) }
		</TableRow>
	);
};

export default DataTableRow;
