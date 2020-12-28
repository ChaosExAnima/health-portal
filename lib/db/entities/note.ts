import {
	Entity,
	Property,
	ManyToOne,
} from '@mikro-orm/core';

import { BaseEntity } from './base';
import { Provider } from './provider';
import { Call } from './call';
import { Claim } from './claim';
import { Appeal } from './appeal';

@Entity()
export class Note extends BaseEntity {
	@Property()
	date = new Date();

	@Property( { type: 'text' } )
	text!: string;

	@ManyToOne( () => Provider )
	parentProvider?: Provider;

	@ManyToOne( () => Claim )
	parentClaim?: Claim;

	@ManyToOne( () => Appeal )
	parentAppeal?: Appeal;
}
