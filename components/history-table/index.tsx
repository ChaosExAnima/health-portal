import {
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core';
import dayjs from 'dayjs';

const HistoryTable: React.FC = () => {
	const events = [
		{ date: dayjs( '1/1/2020' ).format( 'D/M/YYYY' ), name: 'Foo bar' },
	];

	return (
		<>
			<Typography variant="h5" component="h2">
				History
			</Typography>
			<TableContainer>
				<TableHead>
					<TableRow>
						<TableCell>Date</TableCell>
						<TableCell>Event</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{ events.map( ( event, index ) => (
						<TableRow key={ index }>
							<TableCell>{ event.date }</TableCell>
							<TableCell>{ event.name }</TableCell>
						</TableRow>
					) ) }
				</TableBody>
			</TableContainer>
		</>
	);
};

export default HistoryTable;
