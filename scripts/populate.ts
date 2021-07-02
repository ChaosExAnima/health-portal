/* eslint-disable no-console */
import casual from 'casual';
import dayjs from 'dayjs';

import initDB from '../lib/db/index';
import { slugify } from '../lib/strings';


function dateThisYear(): Date {
	return casual.moment.year( 2020 ).toDate();
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

async function run( size: number ): Promise< void > {
	const db = await initDB();
	const numToAssign = Math.floor( size / 2 );

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
		const rep = new Representative(
			casual.first_name,
			pickFromArray( providers )
		);
		await rep.save();
	}
	const reps = await Representative.find();
	console.log( `Inserted ${ reps.length } reps.` );

	for ( let index = 0; index < size; index++ ) {
		const call = new Call();
		call.created = dateThisYear();
		const provider = pickFromArray< Provider >( providers );
		call.provider = Promise.resolve( provider );
		call.slug = slugify(
			`Call on ${ dayjs( call.created ).format( 'D/M' ) } with ${
				provider?.name || 'Unknown'
			}`
		);
		call.reps = Promise.resolve( pickManyFromArray( reps ) );
		await call.save();
	}
	const calls = await Call.find();
	console.log( `Inserted ${ calls.length } calls.` );

	for ( let index = 0; index < size; index++ ) {
		const claim = new Claim();
		claim.created = dateThisYear();
		claim.number = casual.card_number();
		claim.billed = casual.integer( 100, 1000 );
		claim.cost = casual.integer( 0, 50 );
		claim.serviceDate = dateThisYear();
		claim.slug = slugify( claim.number );
		claim.provider = Promise.resolve( pickFromArray( providers ) );

		const status = pickFromArray< string >( [ 'APPROVED', 'PENDING' ] );
		claim.status = status || 'APPROVED';

		const type = pickFromArray< string >( [
			'INNETWORK',
			'OUTOFNETWORK',
			'PHARMACY',
		] );
		claim.type = type;
		await claim.save();
	}
	const claims = await Claim.find();
	const claimsToGiveParents = pickManyFromArray( claims, numToAssign );
	for ( const claim of claimsToGiveParents ) {
		claim.parent = Promise.resolve( pickFromArray( claims ) );
		await claim.save();
	}
	console.log( `Inserted ${ claims.length } claims.` );

	for ( let index = 0; index < size; index++ ) {
		const appeal = new Appeal();
		appeal.created = dateThisYear();
		appeal.name = `Appeal for ${ casual.word }`;
		appeal.slug = slugify(
			`${ dayjs( appeal.created ).format( 'DD/MM/YYYY' ) } - ${
				appeal.name
			}`
		);
		const status = pickFromArray< string >( [
			'NEW',
			'PENDING',
			'CLOSED',
		] );
		appeal.status = status;
		appeal.provider = Promise.resolve( pickFromArray( providers ) );
		appeal.claims = Promise.resolve( pickManyFromArray( claims ) );
		appeal.calls = Promise.resolve( pickManyFromArray( calls ) );

		await appeal.save();
	}
	const appeals = await Appeal.find();
	const appealsToGiveParents = pickManyFromArray( appeals, numToAssign );
	for ( const appeal of appealsToGiveParents ) {
		appeal.parent = Promise.resolve( pickFromArray( appeals ) );
		await appeal.save();
	}
	console.log( `Inserted ${ appeals.length } appeals.` );

	for ( let index = 0; index < size; index++ ) {
		const file = new File();
		file.created = dateThisYear();
		file.filetype = casual.file_extension;
		file.name = `${ casual.word }.${ file.filetype }`;
		file.path = casual.array_of_words( casual.integer( 3, 7 ) ).join( '/' );
		await file.save();
	}
	const files = await File.find();
	console.log( `Inserted ${ appeals.length } appeals.` );

	for ( let index = 0; index < size; index++ ) {
		const payment = new Payment();
		payment.created = dateThisYear();
		payment.method = 'check';
		payment.details = `Deposited ${ dayjs( dateThisYear() ).format(
			'D/M/YYYY'
		) }, check # ${ casual.card_number() }`;
		payment.receipt = Promise.resolve( pickFromArray( files ) );

		const claim = pickFromArray< Claim >( claims );
		payment.amount = casual.integer( 1, claim.cost || 50 );
		payment.claims = Promise.resolve( [ claim ] );
		await payment.save();
	}

	for ( let index = 0; index < size; index++ ) {
		const note = new Note();
		note.created = dateThisYear();
		note.description = casual.text;

		const type = pickFromArray< string >( [
			'claim',
			'appeal',
			'provider',
		] );
		if ( type === 'claim' ) {
			note.claim = Promise.resolve( pickFromArray( claims ) );
		} else if ( type === 'appeal' ) {
			note.appeal = Promise.resolve( pickFromArray( appeals ) );
		} else if ( type === 'provider' ) {
			note.provider = Promise.resolve( pickFromArray( providers ) );
		}

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
