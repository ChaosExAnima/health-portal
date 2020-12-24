import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core';
import EventRow from './event-row';

import type { Event } from 'global-types';

type HistoryTableProps = {
	events: Event[];
};

const HistoryTable: React.FC<HistoryTableProps> = ( { events } ) => {
	// TODO: Move GQL query to here and combine with parent query with fragment.
	return (
		<>
			<Typography variant="h5" component="h2">
				History
			</Typography>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell width="100">Date</TableCell>
							<TableCell width="50">Type</TableCell>
							<TableCell>Event</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{ events.map( ( event ) => <EventRow key={ event.id } { ...event } /> ) }
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default HistoryTable;
