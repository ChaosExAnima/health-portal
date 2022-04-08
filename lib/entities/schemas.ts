import { capitalize } from 'lodash';
import * as yup from 'yup';

import {
	APPEAL_STATUSES,
	CLAIM_STATUSES,
	CLAIM_STATUS_TYPE,
	CLAIM_TYPES,
	CLAIM_TYPES_TYPE,
} from 'lib/constants';

import {
	AppealInput,
	CallInput,
	ClaimInput,
	FileInput,
	NoteInput,
	ProviderInput,
	Slug,
	ToSchema,
} from './types';

// Primitives
export const stringSchema = yup.string().trim();

// Fields
export const idSchema = yup.number().integer().min( 0 ).required();
export const savedIdSchema = idSchema.positive().required();
export const slugSchema = yup.string< Slug >().trim();
export const createdSchema = yup.date();
export const linksSchema = yup.array().of( savedIdSchema ).ensure();

// Entities
export const providerSchema: ToSchema< ProviderInput > = yup
	.object( {
		id: idSchema,
		slug: slugSchema,
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
		description: stringSchema.default( '' ).required(),
		due: yup.date(),
		resolved: yup.bool(),
		links: linksSchema,
	} )
	.required();

export const appealSchema: ToSchema< AppealInput > = yup
	.object( {
		id: idSchema,
		name: stringSchema.required(),
		status: stringSchema.oneOf( APPEAL_STATUSES ).required(),
		notes: schemaNewOrId( noteSchema, 'note' ),
		provider: schemaNewOrId( providerSchema, 'provider' ),
		links: linksSchema,
	} )
	.required();

export const callSchema: ToSchema< CallInput > = yup
	.object( {
		id: idSchema,
		created: createdSchema.default( () => new Date() ),
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

// @ts-expect-error
export const claimSchema: ToSchema< ClaimInput > = yup
	.object( {
		id: idSchema,
		created: createdSchema.required(),
		number: stringSchema.uppercase().required(),
		status: yup.mixed< CLAIM_STATUS_TYPE >().oneOf( CLAIM_STATUSES ),
		type: yup.mixed< CLAIM_TYPES_TYPE >().oneOf( CLAIM_TYPES ),
		billed: yup.number(),
		cost: yup.number(),
		provider: schemaNewOrId( providerSchema, 'provider' ).required(),
		links: linksSchema,
	} )
	.required();

export const fileSchema: ToSchema< FileInput > = yup
	.object( {
		id: idSchema,
		slug: slugSchema.required(),
		created: createdSchema,
		url: stringSchema.url().required(),
		source: stringSchema.required(),
	} )
	.required();

// Utils
function schemaNewOrId< Schema extends yup.AnyObjectSchema >(
	schema: Schema,
	type = 'entity'
) {
	return yup
		.mixed<
			yup.InferType< typeof savedIdSchema > | yup.InferType< Schema >
		>()
		.test(
			'new or saved',
			'${path} is not a valid ID or a new ' + type,
			async ( value ) => {
				const [ isId, isSchema ] = await Promise.all( [
					savedIdSchema.isValid( value ),
					schema.isValid( value ),
				] );
				return isId || isSchema;
			}
		);
}
