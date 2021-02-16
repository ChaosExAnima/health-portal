import { Column, Entity, ManyToOne } from 'typeorm';

import BaseEntity from './base';
import Provider from './provider';

@Entity()
export class Representative extends BaseEntity {
	constructor( name: string, provider: Provider | Promise< Provider > ) {
		super();
		this.name = name;
		this.provider = Promise.resolve( provider );
	}

	@Column( { type: 'varchar' } )
	name: string;

	@ManyToOne( () => Provider )
	provider: Promise< Provider >;
}

export default Representative;
