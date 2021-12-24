import { TableCell, TableHead, TableRow } from '@material-ui/core';

import type { DataTableColumn, DataTableRowData } from './types';

type DataTableHeadProps = {
	columns: DataTableColumn< keyof DataTableRowData >[];
};

const DataTableHeadCell: React.FC< {
	column: DataTableColumn< keyof DataTableRowData >;
} > = ( { column } ) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { name, link, format, key, ...props } = column;
	return <TableCell { ...props }>{ name }</TableCell>;
};

const DataTableHead: React.FC< DataTableHeadProps > = ( { columns } ) => {
	return (
		<TableHead>
			<TableRow>
				{ columns.map( ( column ) => (
					<DataTableHeadCell column={ column } key={ column.key } />
				) ) }
			</TableRow>
		</TableHead>
	);
};

export default DataTableHead;
