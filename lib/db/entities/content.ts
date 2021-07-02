import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	TableInheritance,
} from 'typeorm';

import BaseEntity from './base';

import type Provider from './provider';
import type Meta from './meta';

@Entity()
@TableInheritance( { column: { type: 'varchar', name: 'type' } } )
export default class Content extends BaseEntity {
	@Column( { type: 'varchar', default: '' } )
	@Index()
	identifier: string;

	@Column( { type: 'text', default: '' } )
	info: string;

	@Column( { type: 'varchar', default: '' } )
	status: string;

	@CreateDateColumn()
	@Index()
	created: Date;

	get date(): Date {
		return this.created;
	}

	@ManyToMany( () => Content, ( relation ) => relation.relatedTo, {
		eager: false,
	} )
	@JoinTable( {
		name: 'content_relations',
		joinColumn: {
			name: 'from',
		},
		inverseJoinColumn: {
			name: 'to',
		},
	} )
	relations: Promise< Content[] >;

	@ManyToMany( () => Content, ( relation ) => relation.relations, {
		eager: false,
	} )
	relatedTo: Promise< Content[] >;

	@ManyToOne( 'Provider', 'content', {
		nullable: true,
		eager: false,
	} )
	provider?: Promise< Provider >;

	@OneToMany( 'Meta', 'parent', { eager: false } )
	meta: Meta[];
}
