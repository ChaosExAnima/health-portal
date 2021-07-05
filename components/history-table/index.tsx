import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core';

import EventRow from './event-row';
import { CONTENTS_TYPE } from 'lib/constants';

type HistoryTableProps = {
	type: CONTENTS_TYPE;
	id: number;
};

const HistoryTable: React.FC< HistoryTableProps > = ( {
	type: rawType,
	id,
} ) => {
	const events: { id: number }[] = [];
	const loadMore = () => null;
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
						{ events.map( ( event ) => (
							<EventRow key={ event.id } { ...event } />
						) ) }
					</TableBody>
				</Table>
			</TableContainer>
			{ events.length % 20 === 0 && (
				<Box my={ 2 }>
					<Button color="secondary" onClick={ loadMore }>
						Load more
					</Button>
				</Box>
			) }
		</>
	);
};

export default HistoryTable;
