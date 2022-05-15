// import { testApiHandler } from 'next-test-api-route-handler';
import { createMocks as mockFetch, RequestMethod } from 'node-mocks-http';
import { inspect } from 'util';

import { queryEntities, insertEntity, saveEntity } from 'lib/api/entities';
import { pluralizeType } from 'lib/api/utils';
import { API_ENTITIES, API_ENTITY_TYPE } from 'lib/constants';
import * as dbHelpers from 'lib/db/helpers';
import AppealApiIndex from 'pages/api/appeals';
import AppealApiSingle from 'pages/api/appeals/[slug]';
import CallApiIndex from 'pages/api/calls';
import CallApiSingle from 'pages/api/calls/[slug]';
import ClaimApiIndex from 'pages/api/claims';
import ClaimApiSingle from 'pages/api/claims/[slug]';
import FileApiIndex from 'pages/api/files';
import FileApiSingle from 'pages/api/files/[slug]';
import NoteApiIndex from 'pages/api/notes';
import NoteApiSingle from 'pages/api/notes/[slug]';
import ProviderApiIndex from 'pages/api/providers';
import ProviderApiSingle from 'pages/api/providers/[slug]';

import type { PlainObject } from 'global-types';
import type {
	EntityUpdateResponse,
	ErrorResponse,
	RecordsResponse,
	QueryPagination,
	RecordResponse,
} from 'lib/api/types';
import type { Slug } from 'lib/entities/types';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { Schema } from 'type-fest';

// Maps
const nameToIndex = new Map< API_ENTITY_TYPE, NextApiHandler >( [
	[ 'appeal', AppealApiIndex ],
	[ 'call', CallApiIndex ],
	[ 'claim', ClaimApiIndex ],
	[ 'file', FileApiIndex ],
	[ 'note', NoteApiIndex ],
	[ 'provider', ProviderApiIndex ],
] );
const nameToSingle = new Map< API_ENTITY_TYPE, NextApiHandler >( [
	[ 'appeal', AppealApiSingle ],
	[ 'call', CallApiSingle ],
	[ 'claim', ClaimApiSingle ],
	[ 'file', FileApiSingle ],
	[ 'note', NoteApiSingle ],
	[ 'provider', ProviderApiSingle ],
] );
const nameToMock = new Map< API_ENTITY_TYPE, jest.MockedFunction< any > >( [
	[ 'appeal', dbHelpers.queryAppeals ],
	[ 'call', dbHelpers.queryCalls ],
	[ 'claim', dbHelpers.queryClaims ],
	[ 'file', dbHelpers.queryFiles ],
	[ 'note', dbHelpers.queryNotes ],
	[ 'provider', dbHelpers.queryAllProviders ],
] );

// Tests
describe( '/api/[entity]', () => {
	afterEach( () => {
		jest.clearAllMocks();
	} );

	type Query = Schema< Partial< QueryPagination >, string >;
	type Result = RecordsResponse< any > | EntityUpdateResponse;

	const tests = [
		expectIndexes< undefined, ErrorResponse >(
			undefined,
			{
				success: false,
				errors: [ 'Invalid method' ],
			},
			'HEAD'
		),
		expectIndexes< Query, Result >(
			{},
			{ success: true, records: [ { id: 0, slug: 'test' } ] }
		),
		expectIndexes< Query, Result >(
			{ limit: '1' },
			{ success: true, records: [ { id: 0, slug: 'test' } ] }
		),
		expectIndexes< Query, Result >(
			{ offset: '1' },
			{ success: true, records: [ { id: 0, slug: 'test' } ] }
		),
		expectIndexes< undefined, EntityUpdateResponse >(
			undefined,
			{
				success: true,
				slug: 'test' as Slug,
			},
			'POST'
		),
	];

	for ( const index of tests ) {
		for ( const [ method, type, query, response, handler ] of index ) {
			const nameParts: string[] = [
				method,
				`/api/${ pluralizeType( type ) }`,
			];
			if ( query && Object.keys( query ).length > 0 ) {
				nameParts.push( 'with query', inspect( query ) );
			}
			if ( 'records' in response ) {
				nameParts.push( 'returns records' );
			} else if ( 'slug' in response ) {
				nameParts.push( 'returns a slug' );
			} else if ( response.success === false ) {
				nameParts.push( 'returns an error' );
			}

			test( nameParts.join( ' ' ), async () => {
				const { req, res } = mockFetch<
					NextApiRequest,
					NextApiResponse< Result >
				>( {
					method,
					query,
					url: `/api/${ pluralizeType( type ) }`,
					body: { test: true },
				} );

				if ( 'records' in response ) {
					// @ts-expect-error
					dbHelpers.__records.mockReturnValueOnce( response.records );
				}
				await handler( req, res );

				const body: Result = res._getJSONData();
				expect( body ).toEqual( response );
				if ( 'records' in body ) {
					expect( queryEntities ).toBeCalledWith( query );
					expect( nameToMock.get( type ) ).toBeCalled();
					expect( res._getStatusCode() ).toBe( 200 );
				} else if ( 'slug' in body ) {
					expect( insertEntity ).toBeCalled();
					expect(
						( insertEntity as jest.MockedFunction<
							typeof insertEntity
						> ).mock.calls[ 0 ][ 0 ]
					).toEqual( { test: true } );
					expect( body.slug ).toEqual( 'test' );
				} else if ( body.success === false ) {
					expect( [ 400, 500 ] ).toContain( res._getStatusCode() );
				}
			} );
		}
	}
} );

describe( '/api/[entity]/[slug]', () => {
	afterEach( () => {
		jest.clearAllMocks();
	} );

	type Result = RecordResponse< any > | EntityUpdateResponse;

	const tests = [
		expectIndexes< undefined, ErrorResponse >(
			undefined,
			{
				success: false,
				errors: [ 'Invalid method' ],
			},
			'HEAD'
		),
		expectSingles< any, ErrorResponse >(
			{ notFound: true },
			{
				success: false,
				errors: [ 'Not found' ],
			}
		),
		expectSingles< undefined, RecordResponse< any > >( undefined, {
			success: true,
			record: { id: 0, slug: 'test' },
		} ),
		expectSingles< PlainObject, EntityUpdateResponse >(
			{ id: -1, test: true },
			{
				success: true,
				slug: 'test' as Slug,
			},
			'POST'
		),
	];

	for ( const index of tests ) {
		for ( const [ method, type, body, response, handler ] of index ) {
			const nameParts: string[] = [
				method,
				`/api/${ pluralizeType( type ) }/test`,
			];
			if (
				body &&
				Object.keys( body ).length > 0 &&
				! ( 'notFound' in body )
			) {
				nameParts.push( 'with body', inspect( body ) );
			}
			if ( 'record' in response ) {
				nameParts.push( 'returns a record' );
			} else if ( 'slug' in response ) {
				nameParts.push( 'returns a slug' );
			} else if ( response.success === false ) {
				nameParts.push( 'returns an error' );
			}

			test( nameParts.join( ' ' ), async () => {
				const { req, res } = mockFetch<
					NextApiRequest,
					NextApiResponse< Result >
				>( {
					method,
					body,
					url: `/api/${ pluralizeType( type ) }/test`,
					query: { slug: 'test' },
				} );

				if ( body && 'notFound' in body ) {
					// @ts-expect-error
					dbHelpers.__record.mockReturnValueOnce( undefined );
				}
				await handler( req, res );

				const resBody: Result = res._getJSONData();
				const resStatus = res._getStatusCode();
				expect( resBody ).toEqual( response );
				if ( 'record' in resBody ) {
					expect( resStatus ).toEqual( 200 );
					if ( type === 'provider' ) {
						expect(
							dbHelpers.queryProviderBySlug
						).toHaveBeenCalledWith( 'test' );
					} else {
						expect(
							dbHelpers.getContentBySlug
						).toHaveBeenCalledWith( type, 'test' );
					}
				} else if ( 'slug' in resBody ) {
					expect( resStatus ).toEqual( 200 );
					expect( saveEntity ).toBeCalled();
					expect(
						( saveEntity as jest.MockedFunction<
							typeof saveEntity
						> ).mock.calls[ 0 ][ 0 ]
					).toEqual( { id: 0, test: true } );
				} else if ( 'errors' in resBody ) {
					if ( body && 'notFound' in body ) {
						expect( resStatus ).toEqual( 404 );
					} else {
						expect( [ 400, 500 ] ).toContain( resStatus );
					}
				}
			} );
		}
	}
} );

jest.mock( 'lib/db/helpers', () => {
	const records = jest.fn( () => [] );
	const record = jest.fn( () => ( { id: 0, slug: 'test' } ) );
	const queryBuilder = {
		limit: jest.fn().mockReturnThis(),
		offset: jest.fn( () => records() ),
	};
	const queries = Object.fromEntries(
		[
			'appeal',
			'call',
			'claim',
			'file',
			'note',
			'allProvider',
		].map( ( name ) => [
			`query${ name[ 0 ].toUpperCase() + name.slice( 1 ) }s`,
			jest.fn().mockReturnValue( queryBuilder ),
		] )
	);
	return {
		__records: records,
		__record: record,
		__builder: queryBuilder,
		...jest.requireActual( 'lib/db/helpers' ),
		getContentBySlug: jest.fn( () => record() ),
		queryProviderBySlug: jest.fn( () => record() ),
		...queries,
	};
} );

// Mocks
jest.mock( 'lib/entities/appeal', () => ( {
	rowToAppeal: jest.fn( ( arg ) => arg ),
} ) );
jest.mock( 'lib/entities/call', () => ( {
	rowToCall: jest.fn( ( arg ) => arg ),
} ) );
jest.mock( 'lib/entities/claim', () => ( {
	rowToClaim: jest.fn( ( arg ) => arg ),
} ) );
jest.mock( 'lib/entities/file', () => ( {
	rowToFile: jest.fn( ( arg ) => arg ),
} ) );
jest.mock( 'lib/entities/note', () => ( {
	rowToNote: jest.fn( ( arg ) => arg ),
} ) );
jest.mock( 'lib/entities/provider', () => ( {
	rowToProvider: jest.fn( ( arg ) => arg ),
} ) );

jest.mock( 'lib/api/entities', () => ( {
	...jest.requireActual( 'lib/api/entities' ),
	queryEntities: jest.fn( ( query ) => query ),
	insertEntity: jest.fn( () => ( {
		success: true,
		slug: 'test',
		status: 200,
	} ) ),
	saveEntity: jest.fn( () => ( {
		success: true,
		slug: 'test',
		status: 200,
	} ) ),
} ) );

// Helpers
function expectIndexes< I = any, E = any >(
	input: I,
	expect: E,
	method = 'GET'
): [ RequestMethod, API_ENTITY_TYPE, I, E, NextApiHandler ][] {
	return API_ENTITIES.map( ( entity ) => [
		method as RequestMethod,
		entity,
		input,
		expect,
		nameToIndex.get( entity ) as NextApiHandler< E >,
	] );
}

function expectSingles< I = any, E = any >(
	input: I,
	expect: E,
	method = 'GET'
): [ RequestMethod, API_ENTITY_TYPE, I, E, NextApiHandler ][] {
	return API_ENTITIES.map( ( entity ) => [
		method as RequestMethod,
		entity,
		input,
		expect,
		nameToSingle.get( entity ) as NextApiHandler< E >,
	] );
}
