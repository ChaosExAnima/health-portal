import {
	Container,
	LinearProgress,
	Paper,
	Table,
	TableBody,
	TableContainer,
	TableFooter,
	TablePagination,
	TableRow,
	Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';

import DataTableFilters from './filters';
import DataTableHead from './head';
import DataTableRow from './row';

import type { StringKeys } from 'global-types';
import type {
	DataTableColumn,
	DataTableFilter,
	DataTableRowData,
} from './types';

type DataTableProps< Data > = {
	basePath: string;
	columns: DataTableColumn< StringKeys< Data > >[];
	currentPage: number;
	filters?: DataTableFilter< StringKeys< Data > >[];
	loading: boolean;
	rows?: Data[];
	rowsPerPage?: number;
	totalCount?: number;
	hasDates?: true;
};

export default function DataTable< T extends DataTableRowData >(
	props: DataTableProps< T >
): JSX.Element {
	const {
		basePath,
		columns,
		currentPage,
		filters = [],
		loading,
		rows,
		rowsPerPage = 20,
		totalCount,
		hasDates = false,
	} = props;
	const router = useRouter();
	if ( loading || ! rows ) {
		return (
			<Container maxWidth="md">
				<LinearProgress />
			</Container>
		);
	}

	if ( ! totalCount ) {
		return (
			<Container maxWidth="md">
				<Typography variant="h5" component="p">
					Nothing here yet.
				</Typography>
			</Container>
		);
	}

	return (
		<Container maxWidth="lg">
			<TableContainer component={ Paper }>
				<DataTableFilters filters={ filters } hasDates={ hasDates } />
				<Table>
					<DataTableHead columns={ columns } />
					<TableBody>
						{ rows.map( ( row ) => (
							<DataTableRow
								key={ row.id }
								rowData={ row }
								columns={ columns }
								basePath={ basePath }
							/>
						) ) }
					</TableBody>
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPage={ rowsPerPage }
								rowsPerPageOptions={ [ rowsPerPage ] }
								count={ totalCount }
								page={ currentPage }
								onPageChange={ ( event, page ) =>
									router.push(
										`${ basePath }/page/${ page + 1 }`
									)
								}
							/>
						</TableRow>
					</TableFooter>
				</Table>
			</TableContainer>
		</Container>
	);
}
