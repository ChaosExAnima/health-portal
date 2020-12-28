import {
	PrimaryKey,
	Property,
	Unique,
} from '@mikro-orm/core';

export abstract class BaseEntity {
	@PrimaryKey( { type: 'int' } )
	id!: number;

	@Property( { type: 'string' } )
	@Unique()
	slug!: string;
}
