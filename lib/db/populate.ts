/* eslint-disable no-console */
import casual from 'casual';
import dayjs from 'dayjs';
import {
	EntityRepository,
	Reference,
	wrap,
} from '@mikro-orm/core';

import init from './index';
import {
	Appeal,
	Call,
	Claim,
	File,
	Note,
	Payment,
	Provider,
} from './entities';
import { slugify } from '../strings';

type DBTypes = Appeal | Call | Claim | Note | Payment | Provider | File;

async function saveAndGetObjects<T extends DBTypes>(
	repo: EntityRepository<T>
): Promise<T[]> {
	await repo.flush();
	return await repo.findAll();
}

function dateThisYear(): Date {
	return casual.moment.year( 2020 ).toDate();
}

function pickManyFromArray<T extends DBTypes | string>( array: T[], number = 1 ): T[] {
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

function pickFromArray<T extends DBTypes | string>( array: T[] ): T {
	return pickManyFromArray<T>( array )[ 0 ];
}

function pickRefFromArray<T extends DBTypes>( array: T[] ): Reference<T> {
	const picked = pickFromArray<T>( array );
	return wrap<T, 'id'>( picked ).toReference();
}

async function run( size: number ): Promise<void> {
	const orm = await init();
	const numToAssign = Math.floor( size / 2 );

	const providerRepo = orm.em.getRepository( Provider );
	for ( let index = 0; index < size; index++ ) {
		const provider = new Provider();
		provider.name = casual.coin_flip ? casual.company_name : `Dr. ${ casual.last_name }`;
		provider.slug = slugify( provider.name );
		provider.email = casual.email;
		provider.phone = casual.phone;
		provider.address = casual.address;
		provider.details = casual.text;
		provider.website = casual.url;
		await providerRepo.persist( provider );
	}
	const providers = await saveAndGetObjects<Provider>( providerRepo );
	console.log( `Inserted ${ providers.length } providers.` );

	const callRepo = orm.em.getRepository( Call );
	for ( let index = 0; index < size; index++ ) {
		const call = new Call();
		call.created = dateThisYear();
		const provider = pickFromArray<Provider>( providers );
		call.provider = pickRefFromArray<Provider>( providers );
		call.slug = slugify( `Call on ${ dayjs( call.created ).format( 'D/M' ) } with ${ provider?.name || 'Unknown' }` );
		await callRepo.persist( call );
	}
	const calls = await saveAndGetObjects<Call>( callRepo );
	console.log( `Inserted ${ calls.length } calls.` );

	const claimRepo = orm.em.getRepository( Claim );
	for ( let index = 0; index < size; index++ ) {
		const claim = new Claim();
		claim.created = dateThisYear();
		claim.updated = claim.created;
		claim.number = casual.card_number();
		claim.billed = casual.integer( 100, 1000 );
		claim.cost = casual.integer( 0, 50 );
		claim.serviceDate = dateThisYear();
		claim.slug = slugify( claim.number );
		claim.provider = pickRefFromArray<Provider>( providers );

		const status = pickFromArray<string>( [
			'APPROVED',
			'PENDING',
		] );
		claim.status = status || 'APPROVED';

		const type = pickFromArray<string>( [
			'INNETWORK',
			'OUTOFNETWORK',
			'PHARMACY',
		] );
		claim.type = type;
		await claimRepo.persist( claim );
	}
	const claims = await saveAndGetObjects<Claim>( claimRepo );
	const claimsToGiveParents = pickManyFromArray( claims, numToAssign );
	for ( const claim of claimsToGiveParents ) {
		claim.parent = pickRefFromArray<Claim>( claims );
		await claimRepo.persist( claim );
	}
	await claimRepo.flush();
	console.log( `Inserted ${ claims.length } claims.` );

	const appealRepo = orm.em.getRepository( Appeal );
	for ( let index = 0; index < size; index++ ) {
		const appeal = new Appeal();
		appeal.created = dateThisYear();
		appeal.name = `Appeal for ${ casual.word }`;
		appeal.slug = slugify( `${ dayjs( appeal.created ).format( 'DD/MM/YYYY' ) } - ${ appeal.name }` );
		const status = pickFromArray<string>( [
			'NEW',
			'PENDING',
			'CLOSED',
		] );
		appeal.status = status;
		appeal.provider = pickRefFromArray<Provider>( providers );
		appeal.claims.add( pickFromArray<Claim>( claims ) );
		appeal.calls.add( pickFromArray<Call>( calls ) );

		await appealRepo.persist( appeal );
	}
	const appeals = await saveAndGetObjects<Appeal>( appealRepo );
	const appealsToGiveParents = pickManyFromArray( appeals, numToAssign );
	for ( const appeal of appealsToGiveParents ) {
		appeal.parent = pickRefFromArray<Appeal>( appeals );
		await claimRepo.persist( appeal );
	}
	await claimRepo.flush();
	console.log( `Inserted ${ appeals.length } appeals.` );

	const fileRepo = orm.em.getRepository( File );
	for ( let index = 0; index < size; index++ ) {
		const file = new File();
		file.created = dateThisYear();
		file.filetype = casual.file_extension;
		file.name = `${ casual.word }.${ file.filetype }`;
		file.path = casual.array_of_words( casual.integer( 3, 7 ) ).join( '/' );
		await fileRepo.persist( file );
	}
	const files = await saveAndGetObjects<File>( fileRepo );

	const paymentRepo = orm.em.getRepository( Payment );
	for ( let index = 0; index < size; index++ ) {
		const payment = new Payment();
		payment.date = dateThisYear();
		payment.method = 'check';
		payment.details = `Deposited ${ dayjs( dateThisYear() ).format( 'D/M/YYYY' ) }, check # ${ casual.card_number() }`;
		payment.receipt = pickRefFromArray<File>( files );

		const claim = pickFromArray<Claim>( claims );
		payment.amount = casual.integer( 1, claim.cost || 50 );
		payment.claims.add( claim );

		await paymentRepo.persist( payment );
	}
	await paymentRepo.flush();

	const notesRepo = orm.em.getRepository( Note );
	for ( let index = 0; index < size; index++ ) {
		const note = new Note();
		note.created = dateThisYear();
		note.text = casual.text;

		const type = pickFromArray<string>( [ 'claim', 'appeal', 'provider' ] );
		if ( type === 'claim' ) {
			note.claim = pickRefFromArray<Claim>( claims );
		} else if ( type === 'appeal' ) {
			note.appeal = pickRefFromArray<Appeal>( appeals );
		} else if ( type === 'provider' ) {
			note.provider = pickRefFromArray<Provider>( providers );
		}

		const noteFiles = pickManyFromArray<File>( files );
		noteFiles.forEach( ( file ) => note.files.add( file ) );

		await notesRepo.persist( note );
	}
	await notesRepo.flush();
}

run( 5 )
	.then( () => process.exit() )
	.catch( ( err ) => {
		console.error( err );
		process.exit( 1 );
	} );
