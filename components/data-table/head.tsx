import { TableCell, TableHead, TableRow } from '@material-ui/core';
import { omit } from 'lodash';

import type { DataTableColumn, DataTableRowData } from './types';

type DataTableHeadProps = {
	columns: DataTableColumn< keyof DataTableRowData >[];
};

function DataTableHeadCell( {
	column,
}: {
	column: DataTableColumn< keyof DataTableRowData >;
} ) {
	const { name, ...props } = omit( column, 'link', 'format', 'key' );
	return <TableCell { ...props }>{ name }</TableCell>;
}

export default function DataTableHead( { columns }: DataTableHeadProps ) {
	return (
		<TableHead>
			<TableRow>
				{ columns.map( ( column ) => (
					<DataTableHeadCell column={ column } key={ column.key } />
				) ) }
			</TableRow>
		</TableHead>
	);
}
