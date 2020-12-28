import {
	Entity,
	Property,
	ManyToOne,
	OneToMany,
	Collection,
	ManyToMany,
} from '@mikro-orm/core';

import { BaseEntity } from './base';
import { Provider } from './provider';
import { Call } from './call';
import { Claim } from './claim';
import { Note } from './note';

@Entity()
export class Appeal extends BaseEntity {
	@Property()
	name!: string;

	@Property()
	status!: string;

	@Property()
	created = new Date();

	@Property( { onUpdate: () => new Date() } )
	updated = new Date();

	@ManyToOne()
	provider?: Provider;

	@ManyToOne()
	parent?: Appeal;

	@OneToMany( () => Appeal, ( appeal ) => appeal.parent )
	children = new Collection<Appeal>( this );

	@ManyToMany( () => Claim, ( claim ) => claim.appeals )
	claims = new Collection<Claim>( this );

	@ManyToMany( () => Call )
	calls = new Collection<Call>( this );

	@ManyToMany( () => Provider, ( provider ) => provider.appeals )
	involvedProviders = new Collection<Provider>( this );

	@OneToMany( () => Note, ( note ) => note.parentAppeal )
	notes = new Collection<Note>( this );
}
