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
	@Property( { type: 'string' } )
	name!: string;

	@Property( { type: 'string', nullable: true } )
	phone?: string;

	@Property( { type: 'string', nullable: true } )
	address?: string;

	@Property( { type: 'string', nullable: true } )
	details?: string;

	@Property( { type: 'string', nullable: true } )
	website?: string;

	@Property( { type: 'string', nullable: true } )
	email?: string;

	@OneToMany( () => Note, ( note ) => note.parentProvider )
	notes = new Collection<Note>( this );

	@OneToMany( () => Claim, ( claim ) => claim.provider )
	claims = new Collection<Claim>( this );

	@ManyToMany( () => Appeal )
	appeals = new Collection<Appeal>( this );
}
