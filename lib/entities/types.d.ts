import { Knex } from 'knex';
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

import { Replace, Nullable, RemoveNever } from 'global-types';
import {
	APPEAL_STATUSES_TYPE,
	CLAIM_STATUS_TYPE,
	CLAIM_TYPES_TYPE,
} from 'lib/constants';
import {
	ContentDB,
	DBMaybeInsert,
	ImportDB,
	LoadedRelationDB,
	MetaDB,
	ProviderDB,
} from 'lib/db/types';

// Opaque types
type Id = Opaque< number, 'id' >;
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
	inserted?: number;
	updated?: number;
	file?: FileEntity;
}

interface Appeal extends Content, WithNotes, WithProvider {
	name: string;
	claims?: Claim[];
	status: APPEAL_STATUSES_TYPE;
}

interface Call extends Content, WithNotes, WithProvider {
	reps?: string[];
	reason: string;
	result: string;
	reference?: string;
}

interface Claim extends Content, WithNotes, WithProvider, WithImport {
	number: string;
	type: CLAIM_TYPES_TYPE;
	status: CLAIM_STATUS_TYPE;
	billed?: number;
	cost?: number;
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

// Input interfaces
abstract interface EntityInput {
	id?: number;
}
abstract interface WithProviderInput {
	provider?: number | ProviderInput;
}
abstract interface WithLinksInput {
	links?: number[];
}
interface ProviderInput extends EntityInput {
	name: string;
	slug?: string;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
}
interface AppealInput extends EntityInput, WithProviderInput, WithLinksInput {
	name: string;
	status: APPEAL_STATUSES_TYPE;
}
interface CallInput extends EntityInput, WithProviderInput, WithLinksInput {
	created: Date;
	reps?: string[];
	reason: string;
	result: string;
	reference?: string;
}
interface ClaimInput extends EntityInput, WithLinksInput {
	created: Date;
	number: string;
	type: CLAIM_TYPES_TYPE;
	status: CLAIM_STATUS_TYPE;
	provider: number | ProviderInput;
	billed?: number;
	cost?: number;
}
interface FileInput extends EntityInput {
	url: string;
	source: string;
}
interface NoteInput extends EntityInput, WithLinksInput {
	description: string;
	due?: Date;
	resolved?: boolean;
}

// Input utils
// Functions
type SaveEntityFunction< Input extends EntityInput > = (
	entity: Input
) => Promise< Slug >;
type EntityToRowFunction< Input extends EntityInput > = (
	entity: Input,
	trx?: Knex.Transaction
) => Promisable< DBMaybeInsert< ContentDB > >;
