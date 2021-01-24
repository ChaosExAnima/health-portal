import {
	Entity,
	Column,
	CreateDateColumn,
	ManyToOne,
	ManyToMany,
	JoinTable,
} from 'typeorm';

import BaseEntity from './base';
import Provider from './provider';
import Claim from './claim';
import Appeal from './appeal';
import File from './file';

@Entity()
export default class Note extends BaseEntity {
	@CreateDateColumn()
	created: Date;

	@Column( { type: 'text' } )
	description: string;

	@Column( { type: 'date', nullable: true } )
	due?: Date;

	@Column( { type: 'boolean', default: false } )
	resolved = false;

	@ManyToOne( () => Provider, { nullable: true } )
	provider?: Promise<Provider>;

	@ManyToOne( () => Claim, { nullable: true } )
	claim?: Promise<Claim>;

	@ManyToOne( () => Appeal, { nullable: true } )
	appeal?: Promise<Appeal>;

	@ManyToMany( () => File )
	@JoinTable()
	files: Promise<File[]>;
}
