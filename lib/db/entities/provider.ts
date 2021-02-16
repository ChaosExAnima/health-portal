import { Column, OneToMany, ManyToMany, Entity, JoinTable } from 'typeorm';

import Appeal from './appeal';
import Claim from './claim';
import Note from './note';
import Representative from './representative';
import BaseSlugEntity from './slug';

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

	@Column( { type: 'varchar', nullable: true } )
	website?: string;

	@Column( { type: 'varchar', nullable: true } )
	email?: string;

	@ManyToMany( () => Note, ( note ) => note.providers )
	notes: Promise< Note[] >;

	@OneToMany( () => Claim, ( claim ) => claim.provider )
	claims: Promise< Claim[] >;

	@ManyToMany( () => Appeal )
	@JoinTable()
	appeals: Promise< Appeal[] >;

	@OneToMany( () => Representative, ( rep ) => rep.provider )
	representatives: Promise< Representative[] >;
}
