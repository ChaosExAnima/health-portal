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
export class Note extends BaseEntity {
	@Property( { type: 'date' } )
	created = new Date();

	@Property( { type: 'text' } )
	text!: string;

	@Property( { type: 'text', persist: false } )
	get description(): string {
		return this.text;
	}

	@Property( { type: 'date', nullable: true } )
	due?: Date;

	@Property( { type: 'boolean', nullable: true } )
	resolved?: boolean;

	@ManyToOne( () => Provider, { nullable: true, wrappedReference: true } )
	provider?: IdentifiedReference<Provider>;

	@ManyToOne( () => Claim, { nullable: true, wrappedReference: true } )
	claim?: IdentifiedReference<Claim>;

	@ManyToOne( () => Appeal, { nullable: true, wrappedReference: true } )
	appeal?: IdentifiedReference<Appeal>;

	@ManyToMany( () => File )
	files = new Collection<File>( this );
}

export default Note;
