import { ChildEntity, ManyToOne, ManyToMany } from 'typeorm';

import Content from './content';
import Meta from './meta';

import type Import from './import';
import type Payment from './payment';

@ChildEntity()
export default class Claim extends Content {
	get number(): string {
		return this.identifier;
	}

	@ManyToMany( 'Payment', 'claims' )
	payments: Promise< Payment[] >;

	@ManyToOne( 'Import', 'claims', {
		nullable: true,
	} )
	'import'?: Promise< Import >;
}

@ChildEntity()
export class ClaimMetaServiceDate extends Meta {
	get value(): Date {
		return new Date( this.rawValue );
	}

	set value( val: Date ) {
		this.rawValue = Date.toString();
	}
}

@ChildEntity()
export class ClaimMetaType extends Meta {}

@ChildEntity()
export class ClaimMetaBilled extends Meta {
	get value(): number {
		return Number.parseFloat( this.rawValue );
	}

	set value( val: number ) {
		this.rawValue = val.toString();
	}
}

@ChildEntity()
export class ClaimMetaCost extends Meta {
	get value(): number {
		return Number.parseFloat( this.rawValue );
	}

	set value( val: number ) {
		this.rawValue = val.toString();
	}
}
