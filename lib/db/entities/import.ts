import {
	Entity,
	CreateDateColumn,
	OneToMany,
	Column,
	OneToOne,
	JoinColumn,
	Index,
} from 'typeorm';
import { Provider } from '.';

import BaseEntity from './base';
import Claim from './claim';
import File from './file';

@Entity()
export default class Import extends BaseEntity {
	@OneToMany( () => Claim, ( claim ) => claim.import )
	claims: Promise< Claim[] >;

	@OneToMany( () => Provider, ( provider ) => provider.import )
	import: Promise< Provider[] >;

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
