import {
	Entity,
	Column,
	CreateDateColumn,
	ManyToOne,
	OneToMany,
	ManyToMany,
	Unique,
	DeepPartial,
} from 'typeorm';

import Appeal from './appeal';
import Call from './call';
import Import from './import';
import Note from './note';
import Payment from './payment';
import Provider from './provider';
import BaseEntity from './base';

@Entity()
@Unique( [ 'slug', 'parent' ] )
export default class Claim extends BaseEntity {
	constructor( props: DeepPartial< Claim > = {} ) {
		super();
		Object.assign( this, props );
	}

	@Column()
	slug: string;

	@Column()
	number: string;

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

	@ManyToOne( () => Import, ( importClaims ) => importClaims.claims, {
		nullable: true,
	} )
	'import'?: Promise< Import >;
}
