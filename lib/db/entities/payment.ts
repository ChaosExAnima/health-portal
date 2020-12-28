import {
	Property,
	Collection,
	ManyToMany,
	Entity,
} from '@mikro-orm/core';

import { BaseEntity } from './base';
import { Claim } from './claim';

@Entity()
export class Payment extends BaseEntity {
	@Property( { type: 'float' } )
	amount!: number;

	@Property( { type: 'date' } )
	date = new Date();

	@Property( { type: 'string' } )
	method?: string;

	@Property( { type: 'string' } )
	details?: string;

	@ManyToMany( () => Claim, ( claim ) => claim.payments )
	claims = new Collection<Claim>( this );
}
