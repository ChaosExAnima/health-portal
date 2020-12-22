export type NextURL = URL | string;

export type PageProps = {
	title: string;
}

export type Provider = {
	id: string;
	name: string;
};

export type ClaimTypes = 'dental' | 'in network' | 'out of network' | 'pharmacy';

export type ClaimRow = {
	id: number;
	claim: string;
	date: string;
	provider: Provider;
	type: ClaimTypes;
	billed: number;
	cost: number;
	owed: number;
	status: 'approved' | 'pending' | 'denied' | 'deleted';
};
