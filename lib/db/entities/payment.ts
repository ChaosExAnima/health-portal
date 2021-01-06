import {
	Property,
	Collection,
	ManyToMany,
	Entity,
	ManyToOne,
	IdentifiedReference,
} from '@mikro-orm/core';

import BaseEntity from './base';
import Claim from './claim';
import File from './file';

@Entity()
export class Payment extends BaseEntity {
	@Property( { type: 'float' } )
	amount!: number;

	@Property( { type: 'date' } )
	date = new Date();

	@Property( { type: 'string', nullable: true } )
	method?: string;

	@Property( { type: 'string', nullable: true } )
	details?: string;

	@ManyToMany( () => Claim, ( claim ) => claim.payments )
	claims = new Collection<Claim>( this );

	@ManyToOne( () => File, { wrappedReference: true } )
	receipt?: IdentifiedReference<File>;
}

export default Payment;
