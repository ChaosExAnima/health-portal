import { MaybePromise } from 'global-types';
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
	provider: MaybePromise< Provider >;

	@ManyToMany( () => Representative )
	@JoinTable()
	reps: MaybePromise< Representative[] >;

	@ManyToOne( () => Note, { nullable: true } )
	note?: MaybePromise< Note >;

	@ManyToMany( () => Appeal, ( appeal ) => appeal.calls )
	@JoinTable()
	appeals: MaybePromise< Appeal[] >;

	@ManyToMany( () => Claim, ( claim ) => claim.calls )
	@JoinTable()
	claims: MaybePromise< Claim[] >;
}
