import {
	Entity,
	Property,
	ManyToOne,
	ManyToMany,
	Collection,
	IdentifiedReference,
} from '@mikro-orm/core';
import Appeal from './appeal';
import Claim from './claim';
import Note from './note';

import Provider from './provider';
import Representative from './representative';
import BaseSlugEntity from './slug';

@Entity()
export class Call extends BaseSlugEntity {
	@Property( { type: 'date' } )
	created = new Date();

	@Property( { type: 'date', persist: false } )
	get date(): Date {
		return this.created;
	}

	@ManyToOne( () => Provider, { wrappedReference: true } )
	provider!: IdentifiedReference<Provider>;

	@ManyToMany( () => Representative )
	reps = new Collection<Representative>( this );

	@ManyToOne( () => Note, { nullable: true, wrappedReference: true } )
	note?: IdentifiedReference<Note>;

	@ManyToMany( () => Appeal, ( appeal ) => appeal.calls )
	appeals = new Collection<Appeal>( this );

	@ManyToMany( () => Claim, ( claim ) => claim.calls )
	claims = new Collection<Claim>( this );
}

export default Call;
