import {
	Entity,
	Property,
	ManyToOne,
} from '@mikro-orm/core';

import { BaseEntity } from './base';
import { Provider } from './provider';
import { Claim } from './claim';
import { Appeal } from './appeal';

@Entity()
export class Note extends BaseEntity {
	@Property( { type: 'date' } )
	date = new Date();

	@Property( { type: 'text' } )
	text!: string;

	@ManyToOne( () => Provider, { nullable: true } )
	provider?: Provider;

	@ManyToOne( () => Claim, { nullable: true } )
	claim?: Claim;

	@ManyToOne( () => Appeal, { nullable: true } )
	appeal?: Appeal;
}
