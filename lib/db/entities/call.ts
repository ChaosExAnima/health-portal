import {
	Entity,
	CreateDateColumn,
	ManyToOne,
	ManyToMany,
	JoinTable,
} from 'typeorm';

import Appeal from './appeal';
import Claim from './claim';
import Note from './note';
import Provider from './provider';
import Representative from './representative';
import BaseSlugEntity from './slug';

@Entity()
export default class Call extends BaseSlugEntity {
	@CreateDateColumn()
	created: Date;

	get date(): Date {
		return this.created;
	}

	@ManyToOne( () => Provider )
	provider: Promise< Provider >;

	@ManyToMany( () => Representative )
	@JoinTable()
	reps: Promise< Representative[] >;

	@ManyToOne( () => Note, { nullable: true } )
	note?: Promise< Note >;

	@ManyToMany( () => Appeal, ( appeal ) => appeal.calls )
	@JoinTable()
	appeals: Promise< Appeal[] >;

	@ManyToMany( () => Claim, ( claim ) => claim.calls )
	@JoinTable()
	claims: Promise< Claim[] >;
}
