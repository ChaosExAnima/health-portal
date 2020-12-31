import {
	Entity,
	Property,
	ManyToOne,
	OneToMany,
	Collection,
	ManyToMany,
} from '@mikro-orm/core';

import { Provider } from './provider';
import { Call } from './call';
import { Claim } from './claim';
import { Note } from './note';
import { BaseSlugEntity } from './slug';

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

	@ManyToOne( () => Provider )
	provider!: Provider;

	@ManyToOne( () => Appeal, { nullable: true } )
	parent?: Appeal;

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
