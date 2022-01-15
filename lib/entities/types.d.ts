import { SetRequired } from 'type-fest';
import { Nullable } from 'global-types';
import { APPEAL_STATUSES, CLAIM_STATUSES, CLAIM_TYPES } from 'lib/constants';
import { ContentDB, ImportDB, LoadedRelationDB, MetaDB, ProviderDB } from 'lib/db/types';

type WithField< E extends Entity, Column extends keyof E > = Omit< E, Column > & Required< Pick< E, Column > >;

type EntityAdditions = {
	relations?: LoadedRelationDB[];
	import?: ImportDB;
	provider?: ProviderDB;
	providers?: ProviderDB[];
	meta?: MetaDB[];
};
type WithMetaAdditions< A extends EntityAdditions > = SetRequired< A, 'meta' >;
type WithRelationAdditions< A extends EntityAdditions > = SetRequired< A, 'relations' >;
type EntityWithAdditions< E extends Entity, A extends EntityAdditions > = E & {
	provider: E extends WithProvider & SetRequired< A, 'provider' > ? Provider : never;
	providers: E extends WithProvider & SetRequired< A, 'providers' > ? Provider[]: never;
	import: E extends WithImport & SetRequired< A, 'import' > ? Import : never;
	notes: E extends WithNotes & SetRequired< A, 'relations' > ? Note[] : never;
}

// Abstract interfaces.
abstract interface Entity {
	id: number;
	created: string;
}
abstract interface Content extends Entity {
	slug: string;
}
abstract interface WithProvider {
	provider?: Provider;
}
abstract interface WithImport {
	import?: Import;
}
abstract interface WithNotes {
	notes?: Note[];
}

interface Provider extends Entity, WithNotes, WithImport {
	slug: string;
	name: string;
	address: Nullable< string >;
	phone: Nullable< string >;
	email: Nullable< string >;
	website: Nullable< string >;
	claims?: Claim[];
}

interface Import extends Entity {
	hash: string;
	inserted: Nullable< number >;
	updated: Nullable< number >;
	file?: File;
}

interface Appeal extends Content, WithNotes, WithProvider {
	name: string;
	claims?: Claim[];
	status: typeof APPEAL_STATUSES[ number ];
}

interface Call extends Content, WithNotes, WithProvider {
	reps?: string[];
	reason: string;
	result: string,
}

interface Claim extends Content, WithNotes, WithProvider, WithImport {
	number: string;
	date: string;
	type?: typeof CLAIM_TYPES[ number ];
	status: typeof CLAIM_STATUSES[ number ];
	billed?: Nullable< number >;
	cost?: Nullable< number >;
	appeals?: Appeal[];
}

interface File extends Content, WithNotes {
	path: string;
}

interface Note extends Content {
	description: string;
	files?: File[];
	due?: Nullable< Date >;
	resolved?: boolean;
}
