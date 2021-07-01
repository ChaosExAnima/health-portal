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

import BaseSlugEntity from './slug';

import type Provider from './provider';
import type Meta from './meta';

@Entity()
@TableInheritance( { column: { type: 'varchar', name: 'type' } } )
export default class Content extends BaseSlugEntity {
	@Column( { type: 'varchar', default: '' } )
	@Index()
	identifier: string;

	@Column( { type: 'text', default: '' } )
	info: string;

	@CreateDateColumn()
	@Index()
	created: Date;

	get date(): Date {
		return this.created;
	}

	@ManyToMany( () => Content )
	@JoinTable()
	relations: Content[];

	@ManyToOne( 'Provider', 'content', {
		nullable: true,
	} )
	provider?: Promise< Provider >;

	@OneToMany( 'Meta', 'parent' )
	meta: Meta< Content >[];
}
