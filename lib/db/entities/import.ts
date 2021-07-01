import {
	Entity,
	CreateDateColumn,
	OneToMany,
	Column,
	OneToOne,
	JoinColumn,
	Index,
} from 'typeorm';

import BaseEntity from './base';

import type Claim from './claim';
import type File from './file';
import type Provider from './provider';

@Entity()
export default class Import extends BaseEntity {
	@OneToMany( 'Claim', 'import' )
	claims: Promise< Claim[] >;

	@OneToMany( 'Provider', 'import' )
	provider: Promise< Provider[] >;

	@CreateDateColumn()
	created: Date;

	@Column( { length: 40 } )
	@Index( { unique: true } )
	hash: string;

	@OneToOne( 'File' )
	@JoinColumn()
	file: File;

	@Column( { type: 'smallint', nullable: true } )
	updated?: number;

	@Column( { type: 'smallint', nullable: true } )
	inserted?: number;
}
