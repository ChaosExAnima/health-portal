import { FindConditions } from 'typeorm';

import type { BatchLoadFn } from 'dataloader';
import { Note, File, Provider, Appeal, Claim, Content } from 'lib/db/entities';
import type { TypeResolver } from './index';

type Link = Appeal | Claim | Provider;

const Resolver: TypeResolver< 'Note' > = {
	async files( parent, {}, { dataSources: { db } } ) {
		return db.loader< Note, File[] >( 'Note', 'files' ).load( parent.id );
	},
	async link( parent, {}, { dataSources: { db } } ): Promise< Link[] > {
		// const cb: BatchLoadFn< number, Link[] > = async ( keys ) => {
		// 	const notes = await db.em.findByIds< Note >(
		// 		'Note',
		// 		keys as number[],
		// 		{
		// 			relations: [ 'providers', 'claims', 'appeals' ],
		// 		} as FindConditions< Note >
		// 	);
		// 	return notes.map( ( note ): Link[] => {
		// 		return [
		// 			...( 'length' in note.appeals ? note.appeals : [] ),
		// 			...( 'length' in note.claims ? note.claims : [] ),
		// 			...( 'length' in note.providers ? note.providers : [] ),
		// 		];
		// 	} );
		// };
		const [ relations, provider ] = await Promise.all( [
			db
				.loader< Note, Content[] >( 'Note', 'relations' )
				.load( parent.id ),
			db.loader< Note, Provider >( 'Note', 'provider' ).load( parent.id ),
		] );

		return [
			provider,
			...relations.filter(
				( rel ): rel is Appeal | Claim =>
					rel instanceof Appeal || rel instanceof Claim
			),
		];
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
