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
	@Property()
	number?: string;

	@Property()
	created = new Date();

	@Property( { onUpdate: () => new Date() } )
	updated = new Date();

	@Property()
	serviceDate!: Date;

	@Property()
	type!: string;

	billed?: number;

	cost?: number;

	@Property( { persist: false } )
	get owed(): number {
		return 0;
	}

	@ManyToOne()
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
