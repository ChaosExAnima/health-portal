import {
	Property,
	OneToMany,
	Collection,
	ManyToMany,
	Entity,
} from '@mikro-orm/core';
import { Appeal } from './appeal';

import { BaseEntity } from './base';
import { Claim } from './claim';
import { Note } from './note';

@Entity()
export class Provider extends BaseEntity {
	@Property()
	name!: string;

	@Property()
	phone?: string;

	@Property()
	address?: string;

	@Property()
	details?: string;

	@Property()
	website?: string;

	@Property()
	email?: string;

	@OneToMany( () => Note, ( note ) => note.parentProvider )
	notes = new Collection<Note>( this );

	@OneToMany( () => Claim, ( claim ) => claim.provider )
	claims = new Collection<Claim>( this );

	@ManyToMany( () => Appeal )
	appeals = new Collection<Appeal>( this );
}
