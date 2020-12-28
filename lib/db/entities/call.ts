import { EntitySchema } from '@mikro-orm/core';
import type { Provider } from './provider';

export interface Call {
	id: number;
	date: Date;
	slug: string;
	provider: Provider;
	rep?: string;
	callId?: string;
	reason?: string;
	notes?: string;
}

export const schema = new EntitySchema<Call>( {
	name: 'Call',
	properties: {
		id: { type: 'number', primary: true },
		date: { type: 'Date' },
		slug: { type: 'string', unique: true },
		provider: { reference: '1:1', entity: 'Provider' },
		rep: { type: 'string', nullable: true },
		callId: { type: 'string', nullable: true },
		reason: { type: 'string', nullable: true },
		notes: { type: 'text', nullable: true },
	},
} );
