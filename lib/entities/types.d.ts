import {
	ConditionalExcept,
	ConditionalKeys,
	Except,
	NonNegativeInteger,
	Opaque,
	Promisable,
	SetRequired,
	Simplify,
} from 'type-fest';
import { ObjectSchema } from 'yup';
import { Knex } from 'knex';

import { APPEAL_STATUSES, CLAIM_STATUSES, CLAIM_TYPES } from 'lib/constants';
import {
	ContentDB,
	DBMaybeInsert,
	ImportDB,
	LoadedRelationDB,
	MetaDB,
	ProviderDB,
} from 'lib/db/types';
import { Replace, Nullable, RemoveNever } from 'global-types';

// Opaque types
type Id = Opaque< number, 'id' >;
type NewId = Opaque< 0, 'NewId' >;
type Slug = Opaque< string, 'slug' >;
type DateString = Opaque< string, 'date' >;

// Additions
type EntityAdditions = {
	relations?: LoadedRelationDB[];
	import?: ImportDB;
	provider?: ProviderDB;
	providers?: ProviderDB[];
	meta?: MetaDB[];
};
abstract interface WithProvider {
	provider?: Provider;
}
abstract interface WithImport {
	import?: Import;
}
abstract interface WithNotes {
	notes?: Note[];
}
abstract interface WithLinks {
	links?: Id[];
}
type EntityWithAdditions< E extends Entity, A extends EntityAdditions > = E & {
	provider: E extends WithProvider & SetRequired< A, 'provider' >
		? Provider
		: never;
	providers: E extends WithProvider & SetRequired< A, 'providers' >
		? Provider[]
		: never;
	import: E extends WithImport & SetRequired< A, 'import' > ? Import : never;
	notes: E extends WithNotes & SetRequired< A, 'relations' > ? Note[] : never;
};
type WithMetaAdditions< A extends EntityAdditions > = SetRequired< A, 'meta' >;
type WithRelationAdditions< A extends EntityAdditions > = SetRequired<
	A,
	'relations'
>;

// Entity types
abstract interface Entity {
	id: Id;
	created: DateString;
}
abstract interface Content extends Entity {
	slug: Slug;
}

interface Provider extends Entity, WithNotes, WithImport {
	slug: Slug;
	name: string;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
	claims?: Claim[];
}

interface Import extends Entity {
	hash: string;
	inserted: Nullable< number >;
	updated: Nullable< number >;
	file?: FileEntity;
}

interface Appeal extends Content, WithNotes, WithProvider {
	name: string;
	claims?: Claim[];
	status: typeof APPEAL_STATUSES[ number ];
}

interface Call extends Content, WithNotes, WithProvider {
	reps?: string[];
	reason: string;
	result: string;
	reference?: string;
}

interface Claim extends Content, WithNotes, WithProvider, WithImport {
	number: string;
	type: typeof CLAIM_TYPES[ number ];
	status: typeof CLAIM_STATUSES[ number ];
	billed?: Nullable< number >;
	cost?: Nullable< number >;
	appeals?: Appeal[];
}

interface FileEntity extends Content, WithNotes {
	url: string;
	source: string;
}

interface Note extends Content, WithLinks {
	description: string;
	files?: FileEntity[];
	due?: DateString;
	resolved?: boolean;
}

// Input utils
type InputEntity = MaybeNewEntity & Partial< Pick< Entity, 'created' > >;
type MaybeNewEntity = { id?: Id | NewId };
type CreatedEntity = { created: DateString };
type ProviderEntity = { provider?: Except< ProviderInput, 'id' > | Id };
type WithMaybeNewId< Input > = MaybeNewEntity & Except< Input, 'id' >;
type WithInput< Input extends Entity > = MaybeNewEntity &
	Except<
		Input,
		'id' | 'created' | 'slug' | 'import' | 'notes' | 'provider' | 'claims'
	>;
type WithNumberIds< Input > = Replace< Input, Id | NewId, number >;
type ToSchema< Input > = ObjectSchema< Simplify< WithNumberIds< Input > > >;

// Entity inputs
type ProviderInput = Simplify< WithInput< Provider > & { slug?: string } >;
type AppealInput = Simplify< WithInput< Appeal > & WithLinks & ProviderEntity >;
type CallInput = Simplify<
	WithInput< Call > & WithLinks & ProviderEntity & CreatedEntity
>;
type ClaimInput = Simplify<
	WithInput< Except< Claim, 'appeals' > > &
		WithLinks &
		Required< ProviderEntity > &
		CreatedEntity
>;
type FileInput = WithMaybeNewId< FileEntity >;
type UploadInput = { file: File };
type NoteInput = Simplify< WithInput< Except< Note, 'files' > > & WithLinks >;

// Functions
type SaveEntityFunction< Input > = (
	entity: WithMaybeNewId< Input >
) => Promise< Slug >;
type EntityToRowFunction< Input > = (
	entity: WithMaybeNewId< Input >,
	trx?: Knex.Transaction
) => Promisable< DBMaybeInsert< ContentDB > >;
