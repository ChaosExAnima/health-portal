import {
	Entity,
	Property,
	ManyToOne,
	OneToMany,
	Collection,
	ManyToMany,
} from '@mikro-orm/core';

import { Appeal } from './appeal';
import { BaseEntity } from './base';
import { Note } from './note';
import { Payment } from './payment';
import { Provider } from './provider';

@Entity()
export class Claim extends BaseEntity {
	@Property( { type: 'string' } )
	number?: string;

	@Property( { type: 'date' } )
	created = new Date();

	@Property( { type: 'date', onUpdate: () => new Date() } )
	updated = new Date();

	@Property( { type: 'date' } )
	serviceDate!: Date;

	@Property( { type: 'string' } )
	type!: string;

	@Property( { type: 'float' } )
	billed?: number;

	@Property( { type: 'float' } )
	cost?: number;

	@Property( { type: 'float', persist: false } )
	get owed(): number {
		return 0;
	}

	@ManyToOne( () => Claim )
	parent?: Claim;

	@OneToMany( () => Claim, ( claim ) => claim.parent )
	children = new Collection<Claim>( this );

	@ManyToOne( () => Provider )
	provider = new Collection<Provider>( this );

	@ManyToMany( () => Appeal )
	appeals = new Collection<Appeal>( this );

	@ManyToMany( () => Payment )
	payments = new Collection<Payment>( this );

	@OneToMany( () => Note, ( note ) => note.parentClaim )
	notes = new Collection<Note>( this );
}
