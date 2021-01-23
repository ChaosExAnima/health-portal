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
export class Note extends BaseEntity {
	@CreateDateColumn()
	created: Date;

	@Column( { type: 'text' } )
	description: string;

	@Column( { type: 'date', nullable: true } )
	due?: Date;

	@Column( { type: 'boolean', default: false } )
	resolved = false;

	@ManyToOne( () => Provider, { nullable: true } )
	provider?: Provider;

	@ManyToOne( () => Claim, { nullable: true } )
	claim?: Claim;

	@ManyToOne( () => Appeal, { nullable: true } )
	appeal?: Appeal;

	@ManyToMany( () => File )
	@JoinTable()
	files: File[];
}

export default Note;
