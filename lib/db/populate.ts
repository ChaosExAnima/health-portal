/* eslint-disable no-console */
import casual from 'casual';

import init from './index';
import { Provider } from './entities';
import { slugify } from '../strings';

async function run(): Promise<void> {
	const orm = await init();

	for ( let index = 0; index < 5; index++ ) {
		const provider = new Provider();
		provider.name = casual.coin_flip ? casual.company_name : `Dr. ${ casual.last_name }`;
		provider.slug = slugify( provider.name );
		provider.email = casual.email;
		provider.phone = casual.phone;
		provider.address = casual.address;
		await orm.em.persist( provider );
	}

	try {
		await orm.em.flush();
		const [ result, count ] = await orm.em.findAndCount( Provider, {} );
		console.log( result, count );
	} catch ( err ) {
		console.error( err );
		process.exit( 1 );
	}

	process.exit();
}

run();
