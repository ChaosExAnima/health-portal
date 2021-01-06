import {
	Entity,
	IdentifiedReference,
	ManyToOne,
	Property,
} from '@mikro-orm/core';

import BaseEntity from './base';
import Provider from './provider';

@Entity()
export class Representative extends BaseEntity {
	constructor( name: string ) {
		super();
		this.name = name;
	}

	@Property( { type: 'string' } )
	name!: string;

	@ManyToOne( () => Provider, { wrappedReference: true } )
	provider!: IdentifiedReference<Provider>;
}

export default Representative;
