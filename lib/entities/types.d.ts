import { Nullable } from 'global-types';
import { CLAIM_STATUSES, CLAIM_TYPES } from 'lib/constants';

type WithField< E extends Entity, Column extends keyof E > = Omit< E, Column > & Required< Pick< E, Column > >;

interface Entity {
	id: number;
	created: string;
}

interface Provider extends Entity {
	slug: string;
	name: string;
	address: Nullable< string >;
	phone: Nullable< string >;
	email: Nullable< string >;
	website: Nullable< string >;
	claims?: Claim[];
	notes?: Note[];
	import?: Import;
}

interface Import extends Entity {
	hash: string;
	inserted: Nullable< number >;
	updated: Nullable< number >;
	file?: File;
}

interface Content extends Entity {
	slug: string;
	provider?: Provider;
	import?: Import;
}

interface Appeal extends Content {
	name: string;
	claims?: Claim[];
	notes?: Note[];
}

interface Call extends Content {
	reps?: string[];
	notes?: Note[];
}

interface Claim extends Content {
	number: string;
	date: string;
	type?: typeof CLAIM_TYPES[ number ];
	status: typeof CLAIM_STATUSES[ number ];
	billed?: Nullable< number >;
	cost?: Nullable< number >;
	appeals?: Appeal[];
	notes?: Note[];
}

interface File extends Content {
	path: string;
	url: string;
}

interface Note extends Content {
	description: string;
	files?: File[];
	due?: Nullable< Date >;
	resolved?: boolean;
}
