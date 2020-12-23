export type NextURL = URL | string;

export type PageProps = {
	title: string;
}

type DBRow = {
	id: number;
}

export type Provider = string | DBRow & {
	slug: string;
	name: string;
};

export type ClaimTypes = 'dental' | 'in network' | 'out of network' | 'pharmacy';

export type ClaimRow = DBRow & {
	claim: string;
	date: string;
	provider: Provider;
	type: ClaimTypes;
	billed: number;
	cost: number;
	owed: number;
	status: 'approved' | 'pending' | 'denied' | 'deleted';
};

export type Call = DBRow & {
	provider: Provider;
	date: string;
	notes: string;
};

export type Dispute = DBRow & {
	slug: string;
	provider: Provider;
	date: string;
}

export type EventType = 'payment' | 'call' | 'appeal' | 'note';

export type Event = DBRow & {
	type: EventType;
	date: string;
	description: string;
	link?: Call | Dispute | ClaimRow;
	provider?: Provider;
	icon?: React.ReactNode;
};

