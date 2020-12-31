import {
	Index,
	Property,
	Unique,
} from '@mikro-orm/core';
import BaseEntity from './base';

export default abstract class BaseSlugEntity extends BaseEntity {
	@Property( { type: 'string' } )
	@Unique()
	@Index()
	slug!: string;
}
