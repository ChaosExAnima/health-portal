import { EntitySchema } from '@mikro-orm/core';

export interface Provider {
	id: number;
	slug: string;
	name: string;
	phone?: string;
}

export const schema = new EntitySchema<Provider>( {
	name: 'Provider',
	properties: {
		id: { type: 'number', primary: true },
		slug: { type: 'string', unique: true },
		name: { type: 'string' },
		phone: { type: 'string', nullable: true },
	},
} );
