import { FindConditions } from 'typeorm';

import type { BatchLoadFn } from 'dataloader';
import type { Note, File, Provider, Appeal, Claim } from 'lib/db/entities';
import type { TypeResolver } from './index';

type Link = Appeal | Claim | Provider;

const Resolver: TypeResolver< 'Note' > = {
	async files( parent, {}, { dataSources: { db } } ) {
		return db.loader< Note, File[] >( 'Note', 'files' ).load( parent.id );
	},
	async link( parent, {}, { dataSources: { db } } ): Promise< Link[] > {
		const cb: BatchLoadFn< number, Link[] > = async ( keys ) => {
			const notes = await db.em.findByIds< Note >(
				'Note',
				keys as number[],
				{
					relations: [ 'providers', 'claims', 'appeals' ],
				} as FindConditions< Note >
			);
			return notes.map( ( note ): Link[] => {
				return [
					...( 'length' in note.appeals ? note.appeals : [] ),
					...( 'length' in note.claims ? note.claims : [] ),
					...( 'length' in note.providers ? note.providers : [] ),
				];
			} );
		};
		const loader = db.loader< Note, Link[] >( 'Note', 'providers', cb );
		return loader.load( parent.id );
	},
};

const FileResolver: TypeResolver< 'File' > = {
	type( parent ) {
		return parent.filetype;
	},
};

const LinkResolver: TypeResolver< 'NoteLink' > = {
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
};

export default {
	Query: {},
	Mutation: {},
	Resolver: {
		Note: Resolver,
		NoteLink: LinkResolver,
		File: FileResolver,
	},
};
