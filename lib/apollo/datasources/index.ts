import {
	Appeal,
	Call,
	Claim,
	File,
	Note,
	Payment,
	Provider,
	Representative,
} from 'lib/db/entities';
import MikroAPI from './mikro-api';
import WithDataLoader from './with-dataloader';

import type { MikroORM } from '@mikro-orm/core';
import type { DataSource } from 'apollo-datasource';

class AppealAPI extends WithDataLoader<Appeal> {
	batchLoad( ids: number[] ): Promise<Appeal[]> {
		return this.orm.em.find( Appeal, { id: { $in: ids } } );
	}
}

class CallAPI extends WithDataLoader<Call> {
	refColumns = [ 'claims', 'reps' ] as const;

	batchLoad( ids: number[] ): Promise<Call[]> {
		return this.orm.em.find( Call, { id: { $in: ids } } );
	}

	protected batchCollectionLoad( column: 'claims' | 'reps' ) {
		return async ( parentIds: number[] ): Promise<Claim[] | Representative[]> => {
			const data = await this.dataLoader.loadMany( parentIds );

			const collections = await Promise.all(
				data.map( async ( loaded ) => {
					if ( loaded instanceof Error ) {
						return [];
					}
					return loaded[ column ].loadItems();
				} )
			);
		};
	}
}

class ClaimAPI extends WithDataLoader<Claim> {
	batchLoad( ids: number[] ): Promise<Claim[]> {
		return this.orm.em.find( Claim, { id: { $in: ids } } );
	}
}

class FileAPI extends WithDataLoader<File> {
	batchLoad( ids: number[] ): Promise<File[]> {
		return this.orm.em.find( File, { id: { $in: ids } } );
	}
}

class NoteAPI extends WithDataLoader<Note> {
	batchLoad( ids: number[] ): Promise<Note[]> {
		return this.orm.em.find( Note, { id: { $in: ids } } );
	}
}

class PaymentAPI extends WithDataLoader<Payment> {
	batchLoad( ids: number[] ): Promise<Payment[]> {
		return this.orm.em.find( Payment, { id: { $in: ids } } );
	}
}

class ProviderAPI extends WithDataLoader<Provider> {
	batchLoad( ids: number[] ): Promise<Provider[]> {
		return this.orm.em.find( Provider, { id: { $in: ids } } );
	}
}

class RepresentativeAPI extends WithDataLoader<Representative> {
	batchLoad( ids: number[] ): Promise<Representative[]> {
		return this.orm.em.find( Representative, { id: { $in: ids } } );
	}
}

export type dataSources = {
	db: MikroAPI,
	appeal: AppealAPI,
	call: CallAPI,
	claim: ClaimAPI,
	file: FileAPI,
	note: NoteAPI,
	payment: PaymentAPI,
	provider: ProviderAPI,
	rep: RepresentativeAPI,
};

export default function getDataSources( orm: MikroORM ): Record<string, DataSource> {
	return {
		db: new MikroAPI( orm ),
		appeal: new AppealAPI( orm ),
		call: new CallAPI( orm ),
		claim: new ClaimAPI( orm ),
		file: new FileAPI( orm ),
		note: new NoteAPI( orm ),
		payment: new PaymentAPI( orm ),
		provider: new ProviderAPI( orm ),
		rep: new RepresentativeAPI( orm ),
	} as const;
}
