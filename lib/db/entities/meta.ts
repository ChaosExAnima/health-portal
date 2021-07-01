import { Entity, ManyToOne, TableInheritance } from 'typeorm';

import BaseEntity from './base';

import type Content from './content';

@Entity()
@TableInheritance( { column: { type: 'varchar', name: 'key' } } )
export default class Meta< T extends Content > extends BaseEntity {
	@ManyToOne( 'Content', 'meta' )
	parent: T;
}
