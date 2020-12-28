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
	@Property()
	amount!: number;

	@Property()
	date = new Date();

	@Property()
	method?: string;

	@Property()
	details?: string;

	@ManyToMany( () => Claim, ( claim ) => claim.payments )
	claims = new Collection<Claim>( this );
}
