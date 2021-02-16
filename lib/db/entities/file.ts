import { Entity, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Note } from '.';

import BaseEntity from './base';

@Entity()
export default class File extends BaseEntity {
	@Column( { type: 'varchar' } )
	name: string;

	@CreateDateColumn()
	created: Date;

	@Column( { type: 'varchar', length: 50 } )
	filetype: string;

	@Column( { type: 'varchar' } )
	path: string;

	@ManyToOne( () => Note, { nullable: true } )
	note?: Promise< Note >;
}
