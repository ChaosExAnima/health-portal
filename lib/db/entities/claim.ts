import { Column, ChildEntity, ManyToOne, ManyToMany } from 'typeorm';

import Content from './content';
import Payment from './payment';

import type Import from './import';
import Meta from './meta';

@ChildEntity()
export default class Claim extends Content {
	get claim(): string | undefined {
		return this.identifier;
	}

	@Column()
	status: string;

	@ManyToMany( () => Payment, ( payment ) => payment.claims )
	payments: Promise< Payment[] >;

	@ManyToOne( 'Import', 'claims', {
		nullable: true,
	} )
	'import'?: Promise< Import >;
}

export class ClaimMetaServiceDate extends Meta< Claim > {
	@Column( { type: 'varchar' } )
	value: Date;
}

export class ClaimMetaStatus extends Meta< Claim > {
	@Column( { type: 'varchar' } )
	value: string;
}

export class ClaimMetaBilled extends Meta< Claim > {
	@Column( { type: 'varchar' } )
	value: number;
}

export class ClaimMetaCost extends Meta< Claim > {
	@Column( { type: 'varchar' } )
	value: number;
}
