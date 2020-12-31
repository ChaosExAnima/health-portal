import {
	Entity,
	Property,
	ManyToOne,
	Collection,
	ManyToMany,
	IdentifiedReference,
} from '@mikro-orm/core';

import BaseEntity from './base';
import Provider from './provider';
import Claim from './claim';
import Appeal from './appeal';
import File from './file';

@Entity()
export default class Note extends BaseEntity {
	@Property( { type: 'date' } )
	created = new Date();

	@Property( { type: 'text' } )
	text!: string;

	@Property( { type: 'date', nullable: true } )
	due?: Date;

	@Property( { type: 'boolean', nullable: true } )
	resolved?: boolean;

	@ManyToOne( () => Provider, { nullable: true } )
	provider?: IdentifiedReference<Provider>;

	@ManyToOne( () => Claim, { nullable: true } )
	claim?: IdentifiedReference<Claim>;

	@ManyToOne( () => Appeal, { nullable: true } )
	appeal?: IdentifiedReference<Appeal>;

	@ManyToMany( () => File )
	files = new Collection<File>( this );
}
