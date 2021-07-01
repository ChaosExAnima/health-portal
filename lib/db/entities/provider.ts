import { Column, OneToMany, ManyToMany, Entity, ManyToOne } from 'typeorm';

import BaseSlugEntity from './slug';
import Content from './content';
import Import from './import';
import Note from './note';

@Entity()
export default class Provider extends BaseSlugEntity {
	@Column( { type: 'varchar' } )
	name: string;

	@Column( { type: 'varchar', nullable: true, length: 15 } )
	phone?: string;

	@Column( { type: 'varchar', nullable: true } )
	address?: string;

	@Column( { type: 'text', nullable: true } )
	details?: string;

	@Column( { type: 'varchar', nullable: true, length: 50 } )
	website?: string;

	@Column( { type: 'varchar', nullable: true, length: 40 } )
	email?: string;

	@ManyToMany( () => Note, ( note ) => note.provider )
	notes: Promise< Note[] >;

	@OneToMany( () => Content, ( content ) => content.provider )
	content: Promise< Content[] >;

	@ManyToOne( () => Import, ( importProvider ) => importProvider.provider, {
		nullable: true,
	} )
	'import'?: Promise< Import >;
}
