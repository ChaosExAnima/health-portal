import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core';
import { Event } from 'pages/claims/queries.graphql';
import EventRow from './event-row';

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
						{ events.map( ( event: Event ) => <EventRow key={ event.id } { ...event } /> ) }
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default HistoryTable;
