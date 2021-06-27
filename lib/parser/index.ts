import csv from 'csv-parser';
import { DeepPartial, EntityManager, In } from 'typeorm';
import debug from 'debug';

import {
	getProviderFromClaim,
	isAnthemClaim,
	parseAnthemClaim,
} from './anthem';
import {
	getProviderFromTestClaim,
	isTestClaim,
	parseTestClaim,
} from './test-utils';
import { Claim, Import, Provider } from 'lib/db/entities';
import { slugify } from 'lib/strings';

import type { Readable } from 'stream';
import { getHash, getUniqueSlug, isClaimSame, awaitMap } from './utils';

export type RawClaim = Record< string, string >;
export type ClaimInsertStats = {
	inserted: number;
	updated: number;
};

const log = debug( 'app:parser' );

export default class ImportParser {
	protected isDone = false;
	protected em: EntityManager;

	protected importEntity: Import;
	protected providers: Provider[];
	protected parentClaims: Claim[];

	public constructor( em: EntityManager ) {
		this.em = em;
	}

	public async parse( readStream: Readable ): Promise< void > {
		if ( this.isDone ) {
			throw new Error( 'Already completed parsing!' );
		}
		log( '===== Starting import' );
		let rawClaims: RawClaim[];
		try {
			rawClaims = await this.readCSV( readStream );
			log( 'Read CSV' );
		} catch ( err ) {
			log( err );
			throw new Error( 'Error parsing CSV' );
		}

		if ( rawClaims.length === 0 ) {
			throw new Error( 'No claims found!' );
		}

		const originalEM = this.em;
		const childClaims: Claim[] = [];
		await originalEM.transaction( async ( emt ) => {
			this.em = emt;
			const claimsHash = getHash( rawClaims );
			this.importEntity = await this.getImportOrThrow( claimsHash );
			log( 'Saved import to DB' );

			this.providers = await this.em.find< Provider >( 'Provider' );

			try {
				const newClaims = await awaitMap< Claim >(
					rawClaims,
					this.processClaim.bind( this )
				);
				await this.em.insert< Provider >(
					'Provider',
					this.providers.filter( ( provider ) => ! provider.hasId() )
				);
				log( 'Created claims and providers' );

				// Get old claims and compare to new ones.
				const claimsRepo = this.em.getRepository< Claim >( 'Claim' );
				const newClaimNumbers = newClaims.map(
					( { number } ) => number
				);
				const currentClaims = await claimsRepo.find( {
					where: { number: In( newClaimNumbers ) },
					select: [
						'id',
						'slug',
						'number',
						'status',
						'serviceDate',
						'type',
						'billed',
						'cost',
					],
				} );

				let inserted = 0;
				let updated = 0;
				const validNewClaims = newClaims.filter( ( newClaim ) => {
					const childClaim = currentClaims.find(
						( { number } ) => newClaim.number === number
					);
					if ( ! childClaim ) {
						inserted++;
						return true;
					}
					if ( isClaimSame( newClaim, childClaim ) ) {
						return false;
					}

					newClaim.slug = getUniqueSlug( childClaim.slug );

					childClaim.parent = Promise.resolve( newClaim );
					childClaims.push( childClaim );
					updated++;
					return true;
				} );

				await claimsRepo.insert( validNewClaims );
				log( 'Inserted claims and providers.' );

				await claimsRepo.save( childClaims );
				log( 'Updated parent claims.' );

				await this.em.update< Import >(
					'Import',
					this.importEntity.id,
					{
						inserted,
						updated,
					}
				);
				log( 'Saves totals to import table' );
			} catch ( err ) {
				log( err );
				throw new Error( 'Error parsing claims' );
			}
		} );
		this.em = originalEM;

		this.isDone = true;
	}

	public getTotalUpdated(): number {
		if ( ! this.isDone ) {
			throw new Error( 'Not completed yet!' );
		}
		const { inserted = 0, updated = 0 } = this.importEntity;
		return inserted + updated;
	}

	protected async readCSV( readStream: Readable ): Promise< RawClaim[] > {
		const rawClaims: RawClaim[] = [];
		const stream = readStream
			.pipe( csv( { strict: true } ) )
			.on( 'data', ( data ) => rawClaims.push( data ) );
		return new Promise( ( res, rej ) => {
			stream.on( 'end', () => {
				stream.end();
				res( rawClaims );
			} );
			stream.on( 'error', rej );
		} );
	}

	protected async getImportOrThrow( hash: string ): Promise< Import > {
		const importRepo = this.em.getRepository< Import >( 'Import' );
		if ( await importRepo.findOne( { where: { hash } } ) ) {
			throw new Error( 'Claims have been previously uploaded' );
		}
		return importRepo.save( {
			hash,
		} );
	}

	protected async processClaim( rawClaim: RawClaim ): Promise< Claim > {
		// Extract claim data object from CSV rows.
		let claimData: DeepPartial< Claim >;
		let providerName: string;
		if ( isAnthemClaim( rawClaim ) ) {
			claimData = parseAnthemClaim( rawClaim );
			providerName = getProviderFromClaim( rawClaim );
		} else if ( isTestClaim( rawClaim ) ) {
			claimData = parseTestClaim( rawClaim );
			providerName = getProviderFromTestClaim( rawClaim );
		} else {
			throw new Error( 'Unknown claim type found!' );
		}

		// Create the claim entity.
		if ( ! claimData.number ) {
			throw new Error( 'Number field required' );
		}
		const claimRepo = this.em.getRepository< Claim >( 'Claim' );
		const claim = claimRepo.create( claimData );

		// Get or create the provider.
		let provider = this.providers.find(
			( { name } ) => providerName === name
		);
		if ( ! provider ) {
			provider = this.em.create< Provider >( 'Provider', {
				name: providerName.trim(),
				slug: slugify( providerName ),
			} );
			provider.import = Promise.resolve( this.importEntity );
			this.providers.push( provider );
		}
		claim.provider = Promise.resolve( provider );
		claim.import = Promise.resolve( this.importEntity );

		return claim;
	}
}
