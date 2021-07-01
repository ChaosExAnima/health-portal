import { Column, Entity, ManyToOne, TableInheritance } from 'typeorm';

import BaseEntity from './base';

import type Content from './content';

@Entity()
@TableInheritance( { column: { type: 'varchar', name: 'key' } } )
export default class Meta extends BaseEntity {
	constructor( value?: string ) {
		super();
		if ( value !== undefined ) {
			this.rawValue = value;
		}
	}

	@ManyToOne( 'Content', 'meta' )
	parent: Content;

	@Column( { type: 'varchar', name: 'value' } )
	rawValue: string;
}
