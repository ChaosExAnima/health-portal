import {
	Column,
	ManyToMany,
	Entity,
	ManyToOne,
	CreateDateColumn,
	JoinTable,
} from 'typeorm';

import BaseEntity from './base';
import Claim from './claim';
import File from './file';

@Entity()
export default class Payment extends BaseEntity {
	@Column( { type: 'float' } )
	amount: number;

	@CreateDateColumn()
	created: Date;

	@Column( { type: 'varchar', nullable: true } )
	method?: string;

	@Column( { type: 'varchar', nullable: true } )
	details?: string;

	@ManyToMany( () => Claim, ( claim ) => claim.payments )
	@JoinTable()
	claims: Promise<Claim[]>;

	@ManyToOne( () => File, { nullable: true } )
	receipt?: Promise<File>;
}
