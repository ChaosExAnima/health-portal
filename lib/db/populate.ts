/* eslint-disable no-console */
import casual from 'casual';
import dayjs from 'dayjs';

import init from './index';
import {
	Appeal,
	Call,
	Claim,
	Content,
	File,
	Meta,
	Note,
	Payment,
	Provider,
} from './entities';
import { slugify } from '../strings';
import { CallMetaRep } from './entities/call';
import {
	ClaimMetaBilled,
	ClaimMetaCost,
	ClaimMetaServiceDate,
	ClaimMetaType,
} from './entities/claim';

type DBTypes = Appeal | Call | Claim | Note | Payment | Provider | File;

function dateThisYear(): Date {
	return casual.moment.year( 2021 ).toDate();
}

function pickManyFromArray< T extends DBTypes | string >(
	array: T[],
	number = 1
): T[] {
	let len = array.length;
	const result = new Array( number );
	const taken = new Array( len );
	if ( number > len ) {
		throw new RangeError( 'getRandom: more elements taken than available' );
	}
	while ( number-- ) {
		const x = Math.floor( Math.random() * len );
		result[ number ] = array[ x in taken ? taken[ x ] : x ];
		taken[ x ] = --len in taken ? taken[ len ] : len;
	}
	return result;
}

function pickFromArray< T extends DBTypes | string >( array: T[] ): T {
	return pickManyFromArray< T >( array )[ 0 ];
}

async function saveMeta< T extends Meta >( meta: T ): Promise< T > {
	return meta.save();
}

async function run( size: number ): Promise< void > {
	await init();

	for ( let index = 0; index < size; index++ ) {
		const provider = new Provider();
		provider.name = casual.coin_flip
			? casual.company_name
			: `Dr. ${ casual.last_name }`;
		provider.slug = slugify( provider.name );
		provider.email = casual.email;
		provider.phone = casual.phone;
		provider.address = casual.address;
		provider.details = casual.text;
		provider.website = casual.url;
		await provider.save();
	}
	const providers = await Provider.find();
	console.log( `Inserted ${ providers.length } providers.` );

	for ( let index = 0; index < size; index++ ) {
		const call = new Call();
		call.created = dateThisYear();
		const provider = pickFromArray< Provider >( providers );
		call.provider = Promise.resolve( provider );
		const rep = await new CallMetaRep( casual.first_name ).save();
		call.meta = [ rep ];
		await call.save();
	}
	const calls = await Call.find();
	console.log( `Inserted ${ calls.length } calls.` );

	for ( let index = 0; index < size; index++ ) {
		const claim = new Claim();
		claim.created = dateThisYear();
		claim.identifier = casual.card_number();
		claim.provider = Promise.resolve( pickFromArray( providers ) );

		const status = pickFromArray< string >( [ 'APPROVED', 'PENDING' ] );
		claim.status = status || 'APPROVED';

		claim.meta = await Promise.all(
			[
				new ClaimMetaServiceDate( dateThisYear().toString() ),
				new ClaimMetaType(
					pickFromArray< string >( [
						'INNETWORK',
						'OUTOFNETWORK',
						'PHARMACY',
					] )
				),
				new ClaimMetaBilled( casual.integer( 100, 1000 ).toString() ),
				new ClaimMetaCost( casual.integer( 0, 50 ).toString() ),
			].map( saveMeta )
		);
		await claim.save();
	}
	const claims = await Claim.find( { relations: [ 'meta' ] } );
	console.log( `Inserted ${ size } claims.` );

	for ( let index = 0; index < size; index++ ) {
		const appeal = new Appeal();
		appeal.created = dateThisYear();
		appeal.identifier = `Appeal for ${ casual.word }`;
		const status = pickFromArray< string >( [
			'NEW',
			'PENDING',
			'CLOSED',
		] );
		appeal.status = status;
		appeal.provider = Promise.resolve( pickFromArray( providers ) );

		appeal.relations = Promise.resolve( [
			...pickManyFromArray( claims ),
			...pickManyFromArray( calls ),
		] );

		await appeal.save();
	}
	const appeals = await Appeal.find();
	console.log( `Inserted ${ size } appeals.` );

	for ( let index = 0; index < size; index++ ) {
		const file = new File();
		file.created = dateThisYear();
		file.filetype = casual.file_extension;
		file.name = `${ casual.word }.${ file.filetype }`;
		file.path = casual.array_of_words( casual.integer( 3, 7 ) ).join( '/' );
		await file.save();
	}
	const files = await File.find();
	console.log( `Inserted ${ size } appeals.` );

	for ( let index = 0; index < size; index++ ) {
		const payment = new Payment();
		payment.created = dateThisYear();
		payment.method = 'check';
		payment.details = `Deposited ${ dayjs( dateThisYear() ).format(
			'D/M/YYYY'
		) }, check # ${ casual.card_number() }`;
		payment.receipt = Promise.resolve( pickFromArray( files ) );

		const claim = pickFromArray< Claim >( claims );
		const cost = claim.meta
			.filter( ( meta ) => meta instanceof ClaimMetaCost )
			.shift() as ClaimMetaCost;
		payment.amount = casual.integer( 1, cost.value || 50 );
		payment.claims = Promise.resolve( [ claim ] );
		await payment.save();
	}

	for ( let index = 0; index < size; index++ ) {
		const note = new Note();
		note.created = dateThisYear();
		note.info = casual.text;

		const type = pickFromArray( [ 'claim', 'appeal', 'call' ] );
		let relation: Content = pickFromArray( calls );
		if ( type === 'claim' ) {
			relation = pickFromArray( claims );
		} else if ( type === 'appeal' ) {
			relation = pickFromArray( appeals );
		}
		note.relations = Promise.resolve( [ relation ] );

		note.files = Promise.resolve( pickManyFromArray( files ) );
		await note.save();
	}
}

run( 5 )
	.then( () => process.exit() )
	.catch( ( err ) => {
		console.error( err );
		process.exit( 1 );
	} );
