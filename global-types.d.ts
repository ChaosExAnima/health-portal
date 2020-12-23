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
	slug: string;
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
	slug: string;
	date: string;
	notes: string;
};

export type Dispute = DBRow & {
	slug: string;
	provider: Provider;
	date: string;
}

type EventLink = Call | Dispute | ClaimRow;

export type Event = DBRow & {
	date: string;
	description: string;
	link?: EventLink & { __typename: string };
	provider?: Provider;
	icon?: React.ReactNode;
};

