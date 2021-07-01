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
import File from './file';
import Provider from './provider';

import type Claim from './claim';

@Entity()
export default class Import extends BaseEntity {
	@OneToMany( 'Claim', 'import' )
	claims: Promise< Claim[] >;

	@OneToMany( () => Provider, ( provider ) => provider.import )
	provider: Promise< Provider[] >;

	@CreateDateColumn()
	created: Date;

	@Column( { length: 40 } )
	@Index( { unique: true } )
	hash: string;

	@OneToOne( () => File )
	@JoinColumn()
	file: File;

	@Column( { type: 'smallint', nullable: true } )
	updated?: number;

	@Column( { type: 'smallint', nullable: true } )
	inserted?: number;
}
