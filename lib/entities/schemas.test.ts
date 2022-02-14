import {
	appealSchema,
	callSchema,
	claimSchema,
	createdSchema,
	fileSchema,
	idSchema,
	linksSchema,
	noteSchema,
	providerSchema,
	savedIdSchema,
	stringSchema,
} from './schemas';

import { NewId, ProviderInput } from './types';

const schemaTypes = {
	appeal: appealSchema,
	call: callSchema,
	claim: claimSchema,
	file: fileSchema,
	provider: providerSchema,
	note: noteSchema,
} as const;

type SchemaEntry = [
	keyof typeof schemaTypes,
	typeof schemaTypes[ keyof typeof schemaTypes ]
];

function schemas( ...names: SchemaEntry[ 0 ][] ): SchemaEntry[] {
	return names.map( ( name ) => [ name, schemaTypes[ name ] ] );
}

function withExpect< T >(
	entries: SchemaEntry[],
	...expects: T[]
): [ SchemaEntry[ 0 ], T, SchemaEntry[ 1 ] ][] {
	const tests: [ SchemaEntry[ 0 ], T, SchemaEntry[ 1 ] ][] = [];
	for ( const [ name, schema ] of entries ) {
		for ( const expect of expects ) {
			tests.push( [ name, expect, schema ] );
		}
	}
	return tests;
}

describe( 'field schemas', () => {
	it( 'string gets trimmed', () =>
		expect( stringSchema.validate( ' ' ) ).resolves.toBe( '' ) );
	it( 'id cannot be negative', () =>
		expect( () => idSchema.validate( -1 ) ).rejects.toThrow() );
	it( 'id cannot be a float', () =>
		expect( () => idSchema.validate( 0.1 ) ).rejects.toThrow() );
	it( 'id is coerced to 0', () =>
		expect( idSchema.validate( undefined ) ).resolves.toBe( 0 ) );
	it( 'saved id cannot be negative', () =>
		expect( () => savedIdSchema.validate( -1 ) ).rejects.toThrow() );
	it( 'saved id cannot be zero', () =>
		expect( () => savedIdSchema.validate( 0 ) ).rejects.toThrow() );
	it( 'saved id cannot be coerced', () =>
		expect( () => savedIdSchema.validate( undefined ) ).rejects.toThrow() );
	it( 'created defaults to now', () =>
		expect( createdSchema.validate( undefined ) ).resolves.toBeInstanceOf(
			Date
		) );
	it( 'links are an array of ids', () =>
		expect( linksSchema.validate( [ 1, 2, 3 ] ) ).resolves.toEqual( [
			1,
			2,
			3,
		] ) );
	it( 'links are coerced to an array', () =>
		expect( linksSchema.validate( undefined ) ).resolves.toEqual( [] ) );
	it( 'links throws for non-numbers', () =>
		expect( () => linksSchema.validate( [ 'test' ] ) ).rejects.toThrow() );
	it( 'links throws for invalid ids', () =>
		expect( () => linksSchema.validate( [ -1, 0 ] ) ).rejects.toThrow() );
} );

describe( 'schemas with ids', () => {
	const schemasWithIds = schemas(
		'appeal',
		'call',
		'claim',
		'note',
		'provider'
	);
	test.concurrent.each(
		withExpect( schemasWithIds, 0, 1 )
	)( '%p schema validates id %p', ( _name, id, schema ) =>
		expect( schema.validateAt( 'id', { id } ) ).resolves.toBe( id )
	);
	test.concurrent.each(
		withExpect( schemasWithIds, -1, 1.1, null, Infinity )
	)( '%p schema throws when id is %p', ( _name, id, schema ) =>
		expect( () => schema.validateAt( 'id', { id } ) ).rejects.toThrow()
	);
	test.concurrent.each( schemasWithIds )(
		'%p schema defaults id to 0',
		( _name, schema ) =>
			expect( schema.validateAt( 'id', {} ) ).resolves.toBe( 0 )
	);
} );

describe( 'schemas with links', () => {
	const schemasWithLinks = schemas( 'appeal', 'call', 'claim', 'note' );
	test.concurrent.each(
		withExpect( schemasWithLinks, [], [ 1 ] )
	)( '%p schema validates links are %p', ( _name, links, schema ) =>
		expect( schema.validateAt( 'links', { links } ) ).resolves.toBe( links )
	);
	test.concurrent.each(
		withExpect( schemasWithLinks, [ -1 ], [ 0 ] )
	)( '%p schema throws when links are %p', ( _name, links, schema ) =>
		expect( () =>
			schema.validateAt( 'links', { links } )
		).rejects.toThrow()
	);
	test.concurrent.each(
		schemasWithLinks
	)( '%p schema links default to empty array', ( _name, schema ) =>
		expect( schema.validateAt( 'links', {} ) ).resolves.toHaveLength( 0 )
	);
} );

describe( 'schemas with provider', () => {
	const schemasWithProvider = schemas( 'appeal', 'call', 'claim' );
	test.concurrent.each(
		withExpect< number | ProviderInput >(
			schemasWithProvider,
			1,
			{
				name: 'test',
			},
			{ id: 0 as NewId, name: 'test' }
		)
	)( '%p schema validates provider is %p', ( _name, provider, schema ) =>
		expect( schema.validateAt( 'provider', { provider } ) ).resolves.toBe(
			provider
		)
	);
} );

describe( 'call schema', () => {
	it( 'capitalizes rep names', () =>
		expect(
			callSchema.validateAt( 'reps', { reps: [ 'bob' ] } )
		).resolves.toEqual( [ 'Bob' ] ) );
	it( 'removes falsey rep values', () =>
		expect(
			callSchema.validateAt( 'reps', { reps: [ false ] } )
		).resolves.toEqual( [] ) );
	it( 'reps defaults to an empty array', () =>
		expect(
			callSchema.validateAt( 'reps', { reps: undefined } )
		).resolves.toEqual( [] ) );
} );

describe( 'provider schema', () => {
	it( 'only needs a name', () =>
		expect(
			providerSchema.validate( { name: 'test' } )
		).resolves.toEqual( { id: 0, name: 'test' } ) );
	it( 'throws with invalid email', () =>
		expect( () =>
			providerSchema.validate( { name: 'test', email: 'test' } )
		).rejects.toThrow() );
	it( 'throws with invalid website', () =>
		expect( () =>
			providerSchema.validate( { name: 'test', website: 'test' } )
		).rejects.toThrow() );
	it( 'throws with invalid phone', () =>
		expect( () =>
			providerSchema.validate( { name: 'test', phone: 'test' } )
		).rejects.toThrow() );
	it( 'validates phone without country code', () =>
		expect(
			providerSchema.validate( { name: 'test', phone: '123-456-7890' } )
		).resolves.toBeTruthy() );
	it( 'validates phone with country code', () =>
		expect(
			providerSchema.validate( {
				name: 'test',
				phone: '+1 123-456-7890',
			} )
		).resolves.toBeTruthy() );
	it( 'transforms regular number', () =>
		expect(
			providerSchema.validate( {
				name: 'test',
				phone: '1234567890',
			} )
		).resolves.toEqual( { id: 0, name: 'test', phone: '123-456-7890' } ) );
} );
