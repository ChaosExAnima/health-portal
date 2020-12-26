import React, { useMemo } from 'react';
import { TableCell, TableRow } from '@material-ui/core';
import dayjs from 'dayjs';

import OptionalLink from 'components/optional-link';
import { typeToPath } from 'lib/apollo/utils';
import { toInt, toString } from 'lib/casting';
import numberFormat from 'lib/number-format';

import { DataTableColumn, DataTableRowData } from './types';
import Link from 'components/link';
import { isLinkObject } from './utils';

type DataTableRowProps = {
	rowData: DataTableRowData;
	columns: DataTableColumn[];
};

type DataTableCellProps = DataTableColumn & {
	value: React.ReactNode | number | string | Record<string, unknown>;
	slug?: string;
	__typename?: string;
}

const DataTableCell: React.FC<DataTableCellProps> = ( { value, link, slug, __typename, format, ...props } ) => {
	let text = value;
	if ( value && format && ! React.isValidElement( value ) ) {
		if ( format === 'currency' ) {
			text = numberFormat( toInt( value ), true );
		} else if ( format === 'date' ) {
			text = dayjs( toString( value ) ).format( 'M/D/YYYY' );
		} else if ( format === 'datetime' ) {
			text = dayjs( toString( value ) ).format( 'M/D/YYYY h:mm A' );
		} else if ( typeof format === 'function' ) {
			text = format( value );
		}
	}
	if ( ! React.isValidElement( value ) && typeof value === 'object' && value ) {
		if ( isLinkObject( value ) ) {
			text = (
				<Link color="inherit" href={ typeToPath( value.__typename, value.slug ) }>
					{ value.name }
				</Link>
			);
		}
	}
	return (
		<TableCell { ...props }>
			<OptionalLink href={ link ? typeToPath( __typename, slug ) : '' } color="inherit">
				{ text }
			</OptionalLink>
		</TableCell>
	);
};

const DataTableRow: React.FC<DataTableRowProps> = ( { rowData, columns } ) => {
	const cells: DataTableCellProps[] = useMemo( () => {
		return columns.map( ( column ) => ( {
			...column,
			value: ( rowData[ column.key ] ),
			slug: rowData.slug,
			__typename: rowData.__typename,
		} ) );
	}, [ rowData, columns ] );

	return (
		<TableRow>
			{ cells.map( ( cell ) => <DataTableCell { ...cell } key={ cell.key } /> ) }
		</TableRow>
	);
};

export default DataTableRow;
