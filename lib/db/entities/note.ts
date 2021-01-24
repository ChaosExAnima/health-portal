import {
	Entity,
	Column,
	CreateDateColumn,
	ManyToMany,
	JoinTable,
	OneToMany,
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

	@ManyToMany( () => Provider, ( provider ) => provider.notes, { nullable: true } )
	@JoinTable()
	providers: Promise<Provider[]> | Provider[];

	@ManyToMany( () => Claim, ( claim ) => claim.notes, { nullable: true } )
	@JoinTable()
	claims: Promise<Claim[]> | Claim[];

	@ManyToMany( () => Appeal, ( appeal ) => appeal.notes, { nullable: true } )
	@JoinTable()
	appeals: Promise<Appeal[]> | Appeal[];

	@OneToMany( () => File, ( file ) => file.note )
	files: Promise<File[]>;
}
