import {
	Column,
	OneToMany,
	ManyToMany,
	Entity,
	ManyToOne,
	Index,
} from 'typeorm';

import BaseEntity from './base';

import type Content from './content';
import type Import from './import';
import type Note from './note';

@Entity()
export default class Provider extends BaseEntity {
	@Index( { unique: true } )
	@Column()
	slug: string;

	@Column( { type: 'varchar' } )
	name: string;

	@Column( { type: 'varchar', nullable: true, length: 15 } )
	phone?: string;

	@Column( { type: 'varchar', nullable: true } )
	address?: string;

	@Column( { type: 'text', nullable: true } )
	details?: string;

	@Column( { type: 'varchar', nullable: true, length: 50 } )
	website?: string;

	@Column( { type: 'varchar', nullable: true, length: 40 } )
	email?: string;

	@ManyToMany( 'Note', 'provider' )
	notes: Promise< Note[] >;

	@OneToMany( 'Content', 'provider' )
	content: Promise< Content[] >;

	@ManyToOne( 'Import', 'provider', {
		nullable: true,
	} )
	'import'?: Promise< Import >;
}
