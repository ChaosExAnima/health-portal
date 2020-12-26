import {
	TableCell,
	TableHead,
	TableRow,
} from '@material-ui/core';

import type { DataTableColumn } from './types';

type DataTableHeadProps = {
	columns: DataTableColumn[];
};

const DataTableHeadCell: React.FC<{ column: DataTableColumn }> = ( { column } ) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { name, link, format, key, ...props } = column;
	return (
		<TableCell { ...props }>
			{ name }
		</TableCell>
	);
};

const DataTableHead: React.FC<DataTableHeadProps> = ( { columns } ) => {
	return (
		<TableHead>
			<TableRow>
				{ columns.map( ( column ) => <DataTableHeadCell column={ column } key={ column.key } /> ) }
			</TableRow>
		</TableHead>
	);
};

export default DataTableHead;
