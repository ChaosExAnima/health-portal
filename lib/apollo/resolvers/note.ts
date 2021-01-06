import { wrap } from '@mikro-orm/core';

import type { TypeResolver } from './index';
import {
	Claim,
	Provider,
} from 'lib/db/entities';
import type {
	Maybe,
	ResolversTypes,
} from 'lib/apollo/schema/index.graphqls';

const Resolver: TypeResolver<'Note'> = ( {
	async files( parent ) {
		return parent.files.loadItems();
	},
	async link( parent ): Promise<Maybe<ResolversTypes['NoteLink']>> {
		if ( parent.appeal ) {
			return parent.appeal.load();
		} else if ( parent.claim ) {
			return parent.claim.load();
		} else if ( parent.provider ) {
			return parent.provider.load();
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
