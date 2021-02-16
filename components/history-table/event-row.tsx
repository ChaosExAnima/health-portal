import { TableCell, TableRow } from '@material-ui/core';

import EventIcon from './event-icon';
import OptionalLink from 'components/optional-link';
import { slugToPath } from 'lib/apollo/utils';

import type { Event } from './query.graphql';

type EventRowProps = Omit< Event, 'link' > & {
	link?: {
		__typename: string;
		slug: string;
	} | null;
};

const EventRow: React.FC< EventRowProps > = ( { link, date, description } ) => (
	<TableRow>
		<TableCell>
			<OptionalLink href={ slugToPath( link ) } color="inherit">
				{ date }
			</OptionalLink>
		</TableCell>
		<TableCell>
			<EventIcon type={ link?.__typename } slug={ link?.slug } />
		</TableCell>
		<TableCell>
			<OptionalLink href={ slugToPath( link ) } color="inherit">
				{ description }
			</OptionalLink>
		</TableCell>
	</TableRow>
);

export default EventRow;
