import { PrimaryKey } from '@mikro-orm/core';

export default abstract class BaseEntity {
	@PrimaryKey( { type: 'number' } )
	id!: number;
}
