import { queryClaims } from 'lib/db/helpers';

import Claim from '../classes/claim';
import Provider from '../classes/provider';
import ContentDBFactory from './content-db';
import DBFactory from './factory-db';

import type { ProviderDB } from 'lib/db/types';

export default class ProviderDBFactory extends DBFactory< Provider > {
	protected entities: Map< number, Provider >;

	protected newEntity( row: ProviderDB ): Provider {
		return new Provider().loadFromDB( row );
	}

	public async loadClaims( { meta = false } ): Promise< this > {
		const claimsQuery = queryClaims().whereIn( 'providerId', this.ids );
		const claimFactory = await new ContentDBFactory< Claim >(
			claimsQuery
		).load();
		if ( meta ) {
			await claimFactory.loadMeta();
		}
		for ( const claim of claimFactory ) {
			const entity = this.entities.get( claim.id );
			if ( entity ) {
				entity.claims.push( claim );
				this.entities.set( entity.id, entity );
			}
		}
		return this;
	}
}
