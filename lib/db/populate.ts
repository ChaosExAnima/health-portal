/* eslint-disable no-console */
import casual from 'casual';
import { Collection, EntityRepository } from '@mikro-orm/core';

import init from './index';
import {
	Appeal,
	Call,
	Claim,
	Note,
	Payment,
	Provider,
} from './entities';
import { slugify } from '../strings';
import dayjs from 'dayjs';

type DBTypes = Appeal | Call | Claim | Note | Payment | Provider;

async function saveAndGetObjects<T extends DBTypes>(
	repo: EntityRepository<T>
): Promise<T[]> {
	await repo.flush();
	return await repo.findAll();
}

function dateThisYear(): Date {
	return casual.moment.year( 2020 ).toDate();
}

function pickFromArray<T extends DBTypes | string>( array: T[] ): T | null {
	if ( ! array.length ) {
		return null;
	}
	return array[ casual.integer( 0, array.length ) ];
}

async function run( size: number ): Promise<void> {
	const orm = await init();

	const providerRepo = orm.em.getRepository( Provider );
	for ( let index = 0; index < size; index++ ) {
		const provider = new Provider();
		provider.name = casual.coin_flip ? casual.company_name : `Dr. ${ casual.last_name }`;
		provider.slug = slugify( provider.name );
		provider.email = casual.email;
		provider.phone = casual.phone;
		provider.address = casual.address;
		await providerRepo.persist( provider );
	}
	const providers = await saveAndGetObjects<Provider>( providerRepo );
	console.log( `Inserted ${ providers.length } providers.` );

	const callRepo = orm.em.getRepository( Call );
	for ( let index = 0; index < size; index++ ) {
		const call = new Call();
		call.created = dateThisYear();

		const provider = pickFromArray<Provider>( providers );
		if ( provider ) {
			call.provider = provider;
		}
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
		claim.type = type || 'INNETWORK';

		const provider = pickFromArray<Provider>( providers );
		if ( provider ) {
			claim.provider = provider;
		}
		await claimRepo.persist( claim );
	}
	const claims = await saveAndGetObjects<Claim>( claimRepo );
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
		appeal.status = status || 'NEW';

		const provider = pickFromArray<Provider>( providers );
		if ( provider ) {
			appeal.provider = provider;
		}

		const claim = pickFromArray<Claim>( claims );
		if ( claim ) {
			appeal.claims.add( claim );
		}

		const call = pickFromArray<Call>( calls );
		if ( call ) {
			appeal.calls.add( call );
		}

		await appealRepo.persist( appeal );
	}
	const appeals = await saveAndGetObjects<Appeal>( appealRepo );
	console.log( `Inserted ${ appeals.length } appeals.` );

	const paymentRepo = orm.em.getRepository( Payment );
	for ( let index = 0; index < size; index++ ) {
		const payment = new Payment();
		payment.date = dateThisYear();
		payment.method = 'check';
		payment.details = `Deposited ${ dayjs( dateThisYear() ).format( 'D/M/YYYY' ) }, check # ${ casual.card_number() }`;

		const claim = pickFromArray<Claim>( claims );
		if ( claim ) {
			payment.amount = casual.integer( 1, claim.cost || 50 );
			payment.claims.add( claim );
		}
		payment.slug = slugify( `Payment for claim ${ claim?.number || 'unknown' } on ${ dayjs( payment.date ).format( 'DD/MM/YYYY' ) }` );
		await paymentRepo.persist( payment );
	}
	await paymentRepo.flush();

	const notesRepo = orm.em.getRepository( Note );
	for ( let index = 0; index < size; index++ ) {
		const note = new Note();
		note.date = dateThisYear();
		note.text = casual.sentences( 5 );
		note.slug = slugify( casual.words( 20 ) );

		const type = pickFromArray<string>( [ 'claim', 'appeal', 'provider' ] );
		if ( type === 'claim' ) {
			note.parentClaim = pickFromArray<Claim>( claims ) || undefined;
		} else if ( type === 'appeal' ) {
			note.parentAppeal = pickFromArray<Appeal>( appeals ) || undefined;
		} else if ( type === 'provider' ) {
			note.parentProvider = pickFromArray<Provider>( providers ) || undefined;
		}
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
