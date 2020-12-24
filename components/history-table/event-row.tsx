import {
	TableCell,
	TableRow,
} from '@material-ui/core';

import EventIcon from './event-icon';
import OptionalLink from 'components/optional-link';
import { slugToPath } from 'lib/apollo';

import type { Event } from 'global-types';

type EventRowProps = Event;

const EventRow: React.FC<EventRowProps> = ( { link, date, description } ) => (
	<TableRow>
		<TableCell>
			<OptionalLink href={ slugToPath( link ) } color="inherit">{ date }</OptionalLink>
		</TableCell>
		<TableCell>
			<EventIcon type={ link?.__typename } slug={ link?.slug } />
		</TableCell>
		<TableCell>
			<OptionalLink href={ slugToPath( link ) } color="inherit">{ description }</OptionalLink>
		</TableCell>
	</TableRow>
);

export default EventRow;
