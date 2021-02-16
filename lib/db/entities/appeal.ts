import {
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	ManyToMany,
	JoinTable,
} from 'typeorm';

import BaseSlugEntity from './slug';
import Call from './call';
import Claim from './claim';
import Note from './note';
import Provider from './provider';

@Entity()
export default class Appeal extends BaseSlugEntity {
	@Column()
	name: string;

	@Column()
	status: string;

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	updated: Date;

	@ManyToOne( () => Provider, ( provider ) => provider.appeals )
	provider: Promise< Provider >;

	@ManyToOne( () => Appeal, ( appeal ) => appeal.children, {
		nullable: true,
	} )
	parent?: Promise< Appeal >;

	@OneToMany( () => Appeal, ( appeal ) => appeal.parent )
	children: Promise< Appeal[] >;

	@ManyToMany( () => Claim, ( claim ) => claim.appeals )
	@JoinTable()
	claims: Promise< Claim[] >;

	@ManyToMany( () => Call )
	calls: Promise< Call[] >;

	@ManyToMany( () => Provider, ( provider ) => provider.appeals )
	@JoinTable()
	involvedProviders: Promise< Provider[] >;

	@ManyToMany( () => Note, ( note ) => note.appeals )
	notes: Promise< Note[] >;
}
