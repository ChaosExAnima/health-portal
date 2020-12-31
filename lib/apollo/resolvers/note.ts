import {
	Note,
	Claim,
	Provider,
} from 'lib/db/entities';

import type { TypeResolver } from './index';
import type {
	Maybe,
	ResolversTypes,
} from 'lib/apollo/schema/index.graphqls';
import { wrap } from '@mikro-orm/core';

const Resolver: TypeResolver<'Note'> = ( {
	description( parent ) {
		return parent.text;
	},
	async files( parent, {}, { dataSources: { db } } ) {
		const parentObj = await db.em.findOneOrFail( Note, { id: parent.id }, [ 'files' ] );
		return parentObj.files.toArray() as File[];
	},
	async link( parent, {}, { dataSources: { db } } ): Promise<Maybe<ResolversTypes['NoteLink']>> {
		const parentObj = await db.em.findOneOrFail( Note, { id: parent.id } );
		if ( parentObj.appeal ) {
			return parentObj.appeal;
		} else if ( parentObj.claim ) {
			return parentObj.claim;
		} else if ( parentObj.provider ) {
			return parentObj.provider;
		}
		return null;
	},
} );

const FileResolver: TypeResolver<'File'> = ( {
	type( parent ) {
		return parent.filetype;
	},
} );

const LinkResolver: TypeResolver<'NoteLink'> = ( {
	async __resolveType( parent ) {
		const loadedParent = await wrap( parent ).toReference().load();
		if ( 'involvedProviders' in loadedParent ) {
			return 'Appeal';
		} else if ( parent instanceof Claim ) {
			return 'Claim';
		} else if ( parent instanceof Provider ) {
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
