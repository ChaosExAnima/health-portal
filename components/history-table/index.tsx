import {
	Box,
	Button,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core';

import { Type, useHistoryQuery } from './query.graphql';
import EventRow from './event-row';

type HistoryTableProps = {
	type: 'claim' | 'appeal' | 'provider';
	id: number;
};

function stringToType( type: string ): Type {
	if ( [ 'claim', 'appeal', 'provider' ].includes( type.toLowerCase() ) ) {
		return type.toLowerCase() as Type;
	}
	throw new Error( `Invalid type: ${ type }` );
}

const HistoryTable: React.FC< HistoryTableProps > = ( {
	type: rawType,
	id,
} ) => {
	const type = stringToType( rawType );
	const { data, loading, fetchMore } = useHistoryQuery( {
		variables: { type, id, offset: 0 },
	} );

	if ( loading || ! data?.history ) {
		return <LinearProgress />;
	}
	const events = data.history;
	const loadMore = () =>
		fetchMore( { variables: { offset: events.length } } );

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
