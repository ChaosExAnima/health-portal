import PaymentIcon from '@material-ui/icons/Payment';
import CallIcon from '@material-ui/icons/Phone';
import AppealIcon from '@material-ui/icons/Gavel';
import NoteIcon from '@material-ui/icons/Comment';
import InfoIcon from '@material-ui/icons/Info';

import type { EventType } from 'global-types';

const EventIcon: React.FC<{ type: EventType }> = ( { type } ) => {
	switch ( type.toLowerCase() ) {
		case 'payment':
			return <PaymentIcon />;
		case 'call':
			return <CallIcon />;
		case 'appeal':
			return <AppealIcon />;
		case 'note':
			return <NoteIcon />;
		default:
			return <InfoIcon />;
	}
};

export default EventIcon;
