import {
	Entity,
	Property,
	ManyToOne,
	ManyToMany,
	Collection,
} from '@mikro-orm/core';
import { Appeal } from './appeal';

import { BaseEntity } from './base';
import { Provider } from './provider';

@Entity()
export class Call extends BaseEntity {
	@Property( { type: 'datetime' } )
	created = new Date();

	@ManyToOne( () => Provider )
	provider!: Provider;

	@ManyToMany( () => Appeal, ( appeal ) => appeal.calls )
	appeals = new Collection<Appeal>( this );
}
