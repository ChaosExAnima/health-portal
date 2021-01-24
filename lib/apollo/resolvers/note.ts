import { FindConditions, In } from 'typeorm';

import type { BatchLoadFn } from 'dataloader';
import type {
	Claim,
	Note,
	Provider,
	File,
	Appeal,
} from 'lib/db/entities';
import type { TypeResolver } from './index';
import type {
	Maybe,
	ResolversTypes,
} from 'lib/apollo/schema/index.graphqls';

const Resolver: TypeResolver<'Note'> = ( {
	async files( parent, {}, { dataSources: { db } } ) {
		return db.loader<Note, File[]>( 'Note', 'files' ).load( parent.id );
	},
	async link( parent, {}, { dataSources: { db } } ): Promise<Maybe<ResolversTypes['NoteLink']>> {
		const cb: BatchLoadFn<number, Maybe<ResolversTypes['NoteLink']>> = async ( keys ) => {
			const notes = await db.get().find<Note>(
				'Note',
				{ id: In( keys as number[] ), relations: [ 'provider', 'claim', 'appeal' ], select: [ 'provider', 'claim', 'appeal' ] } as FindConditions<Note>
			);
			return notes.map( ( note ) => {
				if ( note.provider ) {
					return note.provider;
				} else if ( note.claim ) {
					return note.claim;
				} else if ( note.appeal ) {
					return note.appeal;
				}
				return null;
			} );
		};
		const loader = db.loader<Note, Maybe<ResolversTypes['NoteLink']>>( 'Note', 'provider', cb );
		return loader.load( parent.id );
	},
} );

const FileResolver: TypeResolver<'File'> = ( {
	type( parent ) {
		return parent.filetype;
	},
} );

const LinkResolver: TypeResolver<'NoteLink'> = ( {
	async __resolveType( parent ) {
		if ( 'involvedProviders' in parent ) {
			return 'Appeal';
		} else if ( 'payments' in parent ) {
			return 'Claim';
		} else if ( 'address' in parent ) {
			return 'Provider';
		}
		return null;
	},
} );

export default {
	Query: {},
	Mutation: {},
	Resolver: {
		Note: Resolver,
		NoteLink: LinkResolver,
		File: FileResolver,
	},
};
