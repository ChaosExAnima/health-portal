import {
	Entity,
	Property,
	ManyToOne,
	OneToMany,
	Collection,
	ManyToMany,
	IdentifiedReference,
} from '@mikro-orm/core';

import Appeal from './appeal';
import Call from './call';
import Note from './note';
import Payment from './payment';
import Provider from './provider';
import BaseSlugEntity from './slug';

@Entity()
export class Claim extends BaseSlugEntity {
	@Property( { type: 'string', nullable: true } )
	number?: string;

	@Property( { type: 'string', persist: false } )
	get claim(): string | undefined {
		return this.number;
	}

	@Property( { type: 'date' } )
	created = new Date();

	@Property( { type: 'date', persist: false } )
	get date(): Date {
		return this.created;
	}

	@Property( { type: 'string' } )
	status!: string;

	@Property( { type: 'date' } )
	serviceDate!: Date;

	@Property( { type: 'string' } )
	type!: string;

	@Property( { type: 'float', nullable: true } )
	billed?: number;

	@Property( { type: 'float', nullable: true } )
	cost?: number;

	@Property( { type: 'float', persist: false } )
	get owed(): number {
		return 0;
	}

	@ManyToOne( () => Claim, { nullable: true, wrappedReference: true } )
	parent?: IdentifiedReference<Claim>;

	@OneToMany( () => Claim, ( claim ) => claim.parent )
	children = new Collection<Claim>( this );

	@ManyToOne( () => Provider, { wrappedReference: true } )
	provider!: IdentifiedReference<Provider>;

	@ManyToMany( () => Appeal )
	appeals = new Collection<Appeal>( this );

	@ManyToMany( () => Payment )
	payments = new Collection<Payment>( this );

	@OneToMany( () => Note, ( note ) => note.claim )
	notes = new Collection<Note>( this );

	@ManyToMany( () => Call )
	calls = new Collection<Call>( this );
}

export default Claim;
