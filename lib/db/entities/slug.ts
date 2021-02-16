import { Column, Index } from 'typeorm';

import BaseEntity from './base';

export default abstract class BaseSlugEntity extends BaseEntity {
	@Index( { unique: true } )
	@Column()
	slug: string;
}
