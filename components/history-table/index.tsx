import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core';

import EventIcon from './event-icon';

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
						{ events.map( ( event, index ) => (
							<TableRow key={ index }>
								<TableCell>{ event.date }</TableCell>
								<TableCell><EventIcon type={ event.link?.__typename } slug={ event.link?.slug } /></TableCell>
								<TableCell>{ event.description }</TableCell>
							</TableRow>
						) ) }
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default HistoryTable;
