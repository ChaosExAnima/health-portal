import PaymentIcon from '@material-ui/icons/Payment';
import CallIcon from '@material-ui/icons/Phone';
import AppealIcon from '@material-ui/icons/Gavel';
import NoteIcon from '@material-ui/icons/Comment';
import InfoIcon from '@material-ui/icons/Info';

import type { EventType } from 'global-types';
import { Tooltip } from '@material-ui/core';

const EventIcon: React.FC<{ type: EventType }> = ( { type } ) => {
	switch ( type.toLowerCase() ) {
		case 'payment':
			return (
				<Tooltip title="Payment">
					<PaymentIcon />
				</Tooltip>
			);
		case 'call':
			return (
				<Tooltip title="Call">
					<CallIcon />
				</Tooltip>
			);
		case 'appeal':
			return (
				<Tooltip title="Appeal">
					<AppealIcon />
				</Tooltip>
			);
		case 'note':
			return (
				<Tooltip title="Note">
					<NoteIcon />
				</Tooltip>
			);
		default:
			return (
				<Tooltip title="Other">
					<InfoIcon />
				</Tooltip>
			);
	}
};

export default EventIcon;
