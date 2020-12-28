import {
	PrimaryKey,
	Property,
	Unique,
} from '@mikro-orm/core';

export abstract class BaseEntity {
	@PrimaryKey()
	id!: number;

	@Property()
	@Unique()
	slug!: string;
}
