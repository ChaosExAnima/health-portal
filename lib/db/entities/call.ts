import {
	Entity,
	Property,
	ManyToOne,
	ManyToMany,
	Collection,
	OneToOne,
} from '@mikro-orm/core';
import { Appeal } from './appeal';
import { Claim } from './claim';
import { Note } from './note';

import { Provider } from './provider';
import { BaseSlugEntity } from './slug';

@Entity()
export class Call extends BaseSlugEntity {
	@Property( { type: 'date' } )
	created = new Date();

	@ManyToOne( () => Provider )
	provider!: Provider;

	@ManyToOne( () => Note, { nullable: true } )
	note?: Note;

	@ManyToMany( () => Appeal, ( appeal ) => appeal.calls )
	appeals = new Collection<Appeal>( this );

	@ManyToMany( () => Claim, ( claim ) => claim.calls )
	claims = new Collection<Claim>( this );
}
