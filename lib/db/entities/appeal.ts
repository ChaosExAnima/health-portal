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
	provider: Provider;

	@ManyToOne( () => Appeal, ( appeal ) => appeal.children, { nullable: true } )
	parent?: Appeal;

	@OneToMany( () => Appeal, ( appeal ) => appeal.parent )
	children: Appeal[];

	@ManyToMany( () => Claim, ( claim ) => claim.appeals )
	@JoinTable()
	claims: Claim[];

	@ManyToMany( () => Call )
	calls: Call[];

	@ManyToMany( () => Provider, ( provider ) => provider.appeals )
	@JoinTable()
	involvedProviders: Provider[];

	@OneToMany( () => Note, ( note ) => note.appeal )
	notes: Note[];
}
