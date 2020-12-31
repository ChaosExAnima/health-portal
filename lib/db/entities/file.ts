import {
	Entity,
	Property,
} from '@mikro-orm/core';

import { BaseEntity } from './base';

@Entity()
export class File extends BaseEntity {
	@Property( { type: 'string' } )
	name!: string;

	@Property( { type: 'date' } )
	created = new Date();

	@Property( { type: 'string', length: 50 } )
	filetype!: string;

	@Property( { type: 'string' } )
	path!: string;
}
