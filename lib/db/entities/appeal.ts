import {
	Entity,
	Property,
	ManyToOne,
	OneToMany,
	Collection,
	ManyToMany,
	IdentifiedReference,
} from '@mikro-orm/core';

import BaseSlugEntity from './slug';
import Call from './call';
import Claim from './claim';
import Note from './note';
import Provider from './provider';

@Entity()
export class Appeal extends BaseSlugEntity {
	@Property( { type: 'string' } )
	name!: string;

	@Property( { type: 'string' } )
	status!: string;

	@Property( { type: 'date' } )
	created = new Date();

	@Property( { type: 'date', onUpdate: () => new Date() } )
	updated = new Date();

	@ManyToOne( () => Provider, { wrappedReference: true } )
	provider!: IdentifiedReference<Provider>;

	@ManyToOne( () => Appeal, { nullable: true, wrappedReference: true } )
	parent?: IdentifiedReference<Appeal>;

	@OneToMany( () => Appeal, ( appeal ) => appeal.parent )
	children = new Collection<Appeal>( this );

	@ManyToMany( () => Claim, ( claim ) => claim.appeals )
	claims = new Collection<Claim>( this );

	@ManyToMany( () => Call )
	calls = new Collection<Call>( this );

	@ManyToMany( () => Provider, ( provider ) => provider.appeals )
	involvedProviders = new Collection<Provider>( this );

	@OneToMany( () => Note, ( note ) => note.appeal )
	notes = new Collection<Note>( this );
}

export default Appeal;
