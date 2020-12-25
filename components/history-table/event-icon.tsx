import { Tooltip, IconButton } from '@material-ui/core';
import Link from 'next/link';
import PaymentIcon from '@material-ui/icons/Payment';
import CallIcon from '@material-ui/icons/Phone';
import AppealIcon from '@material-ui/icons/Gavel';
import NoteIcon from '@material-ui/icons/Comment';
import ReceiptIcon from '@material-ui/icons/Receipt';

import { typeToPath } from 'lib/apollo/utils';

type EventIconProps = {
	type?: string;
	slug?: string;
}

const EventIconLink: React.FC<EventIconProps> = ( { type, slug } ) => {
	if ( ! type ) {
		return <EventIcon type="note" />;
	} else if ( slug ) {
		return (
			<Link href={ typeToPath( type, slug ) }>
				<IconButton><EventIcon type={ type } /></IconButton>
			</Link>
		);
	}
	return <EventIcon type={ type.toLowerCase() } />;
};

const EventIcon: React.FC<{ type: string }> = ( { type } ) => {
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
		case 'dispute':
			return (
				<Tooltip title="Dispute">
					<AppealIcon />
				</Tooltip>
			);
		case 'claim':
			return (
				<Tooltip title="Claim">
					<ReceiptIcon />
				</Tooltip>
			);
		case 'note':
		default:
			return (
				<Tooltip title="Note">
					<NoteIcon />
				</Tooltip>
			);
	}
};

export default EventIconLink;
