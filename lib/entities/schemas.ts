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
export const stringSchema = yup.string().trim();

// Fields
export const idSchema = yup.number().integer().min( 0 ).default( 0 );
export const savedIdSchema = idSchema.positive().required();
export const createdSchema = yup.date().default( () => new Date() );
export const linksSchema = yup.array().of( savedIdSchema ).ensure();

// Entities
export const providerSchema: ToSchema< ProviderInput > = yup
	.object( {
		id: idSchema,
		slug: stringSchema,
		name: stringSchema.required(),
		address: stringSchema,
		email: stringSchema.email(),
		website: stringSchema.url(),
		phone: stringSchema
			.transform( ( value: string ) =>
				value.length === 10
					? value.replace( /^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3' )
					: value
			)
			.matches( /^(\+?\d )?\d{3}-\d{3}-\d{4}$/ ),
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
		provider: schemaNewOrId( providerSchema, 'provider' ),
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
		status: yup.mixed().oneOf( [ ...CLAIM_STATUSES ] ),
		type: yup.mixed().oneOf( [ ...CLAIM_TYPES ] ),
		billed: yup.number(),
		cost: yup.number(),
		provider: schemaNewOrId( providerSchema, 'provider' ).required(),
		links: linksSchema,
	} )
	.required();

export const fileSchema: ToSchema< FileInput > = yup
	.object( {
		id: idSchema.when( 'file', {
			is: ( file: unknown ) => !! file,
			then: ( schema ) => schema.strip(),
		} ),
		file: yup.mixed().default( null ),
		url: stringSchema.url().when( 'file', {
			is: null,
			then: ( schema ) => schema.required(),
		} ),
		source: stringSchema.when( 'file', {
			is: null,
			then: ( schema ) => schema.required(),
		} ),
	} )
	.required();

// Utils
function schemaNewOrId( schema: yup.AnyObjectSchema, type = 'entity' ) {
	return yup
		.mixed<
			| yup.InferType< typeof savedIdSchema >
			| yup.InferType< typeof schema >
		>()
		.test(
			'new or saved',
			'${path} is not a valid ID or a new ' + type,
			async ( value ) =>
				( await savedIdSchema.isValid( value ) ) ||
				( await schema.isValid( value ) )
		);
}
