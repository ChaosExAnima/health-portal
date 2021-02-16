import {
	Entity,
	Column,
	CreateDateColumn,
	ManyToOne,
	OneToMany,
	ManyToMany,
} from 'typeorm';

import Appeal from './appeal';
import Call from './call';
import Note from './note';
import Payment from './payment';
import Provider from './provider';
import BaseSlugEntity from './slug';

@Entity()
export default class Claim extends BaseSlugEntity {
	@Column( { nullable: true } )
	number?: string;

	get claim(): string | undefined {
		return this.number;
	}

	@CreateDateColumn()
	created: Date;

	get date(): Date {
		return this.created;
	}

	@Column()
	status: string;

	@Column()
	serviceDate: Date;

	@Column()
	type: string;

	@Column( { type: 'float', nullable: true } )
	billed?: number;

	@Column( { type: 'float', nullable: true } )
	cost?: number;

	get owed(): number {
		return 0;
	}

	@ManyToOne( () => Claim, ( claim ) => claim.children, {
		nullable: true,
		onDelete: 'SET NULL',
	} )
	parent?: Promise< Claim >;

	@OneToMany( () => Claim, ( claim ) => claim.parent )
	children: Promise< Claim[] >;

	@ManyToOne( () => Provider, ( provider ) => provider.claims, {
		nullable: true,
		onDelete: 'SET NULL',
	} )
	provider?: Promise< Provider >;

	@ManyToMany( () => Appeal, ( appeal ) => appeal.claims )
	appeals: Promise< Appeal[] >;

	@ManyToMany( () => Payment, ( payment ) => payment.claims )
	payments: Promise< Payment[] >;

	@ManyToMany( () => Note, ( note ) => note.claims )
	notes: Promise< Note[] >;

	@ManyToMany( () => Call, ( call ) => call.claims )
	calls: Promise< Call[] >;
}
