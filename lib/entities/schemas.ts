import { CLAIM_STATUSES, CLAIM_TYPES } from 'lib/constants';
import { capitalize } from 'lodash';
import * as yup from 'yup';

import {
	AppealInput,
	CallInput,
	ClaimInput,
	FileInput,
	NoteInput,
	ProviderInput,
	ToSchema,
} from './types';

// Primitives
const stringSchema = yup.string().trim();

// Fields
const idSchema = yup.number().positive().default( 0 );
const createdSchema = yup.date().default( () => new Date() );
const linksSchema = yup.array().of( idSchema.required() ).ensure();

// Entities
export const providerSchema: ToSchema< ProviderInput > = yup
	.object( {
		id: idSchema,
		slug: stringSchema,
		name: stringSchema.required(),
		address: stringSchema,
		email: stringSchema.email(),
		website: stringSchema.url(),
		phone: stringSchema.matches( /^(\+?\d-)?\d{3}-\d{3}\d{4}$/ ),
	} )
	.required();

export const noteSchema: ToSchema< NoteInput > = yup
	.object( {
		id: idSchema,
		description: stringSchema,
		due: yup.date(),
		resolved: yup.bool(),
		links: linksSchema,
	} )
	.required();

export const appealSchema: ToSchema< AppealInput > = yup
	.object( {
		id: idSchema,
		name: stringSchema.required(),
		status: stringSchema.oneOf( [ 'foo' ] ).required(),
		notes: schemaNewOrId( noteSchema, 'note' ),
		provider: schemaNewOrId( providerSchema, 'provider' ),
		links: linksSchema,
	} )
	.required();

export const callSchema: ToSchema< CallInput > = yup
	.object( {
		id: idSchema,
		created: createdSchema,
		provider: schemaNewOrId( providerSchema ),
		reps: yup
			.array()
			.of( stringSchema.required().transform( capitalize ) )
			.ensure()
			.compact(),
		reason: stringSchema.required(),
		reference: stringSchema,
		result: stringSchema.required(),
		links: linksSchema,
	} )
	.required();

export const claimSchema: ToSchema< ClaimInput > = yup
	.object( {
		id: idSchema,
		created: createdSchema.required(),
		number: stringSchema.required(),
		status: yup.mixed().oneOf( CLAIM_STATUSES ),
		type: yup.mixed().oneOf( CLAIM_TYPES ),
		billed: yup.number(),
		cost: yup.number(),
		provider: schemaNewOrId( providerSchema ).required(),
		links: linksSchema,
	} )
	.required();

export const fileSchema: ToSchema< FileInput > = yup
	.mixed()
	.oneOf( [
		yup
			.object( {
				url: stringSchema.required(),
				source: stringSchema.required(),
			} )
			.required(),
		yup.object( {
			file: yup.object( { name: stringSchema.required() } ).required(),
		} ),
	] )
	.required();

// Utils
function schemaNewOrId( schema: yup.AnyObjectSchema, type = 'entity' ) {
	return yup
		.mixed()
		.oneOf(
			[ schema, idSchema ],
			`Either provide a new ${ capitalize( type ) } or an id`
		);
}
