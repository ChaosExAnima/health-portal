import { DataSource } from 'apollo-datasource';
import DataLoader, { BatchLoadFn } from 'dataloader';
import type {
	Connection,
	EntityManager,
	FindConditions,
	FindManyOptions,
	ObjectLiteral,
	Repository,
} from 'typeorm';

export class TypeORM extends DataSource {
	private readonly connection: Connection;
	private readonly entityManager: EntityManager;

	private loaders = new Map();

	constructor( connection: Connection ) {
		super();
		this.connection = connection;
		this.entityManager = connection.createEntityManager();
	}

	findAndCount< P >(
		entity: string,
		skip: number | null,
		pick: number | null
	): Promise< [ P[], number ] > {
		return this.entityManager.findAndCount< P >( entity, {
			skip,
			pick,
		} as FindManyOptions );
	}

	async findBySlug< P >( entity: string, slug: string ): Promise< P > {
		return this.entityManager.findOneOrFail< P >( entity, {
			where: { slug },
		} );
	}

	private batchFn< P, L >(
		entity: string,
		column: keyof P
	): BatchLoadFn< number, L > {
		return async ( keys ) => {
			const items: P[] = await this.entityManager.findByIds< P >(
				entity,
				keys as number[],
				( { relations: [ column ] } as unknown ) as FindConditions< P >
			);
			return items.map( ( item ) => ( item[ column ] as unknown ) as L );
		};
	}

	loader< P, L >(
		entity: string,
		column: keyof P,
		cb?: BatchLoadFn< number, L >
	): DataLoader< number, L > {
		const name = `${ entity }-${ column }`;
		if ( ! this.loaders.has( name ) ) {
			this.loaders.set(
				name,
				new DataLoader< number, L >(
					cb || this.batchFn< P, L >( entity, column )
				)
			);
		}
		return this.loaders.get( name );
	}

	get em(): EntityManager {
		return this.entityManager;
	}

	repo< Entity extends ObjectLiteral >(
		entity: string
	): Repository< Entity > {
		return this.entityManager.getRepository< Entity >( entity );
	}

	get conn(): Connection {
		return this.connection;
	}
}

export type dataSources = {
	db: TypeORM;
};

export default function getDataSources(
	connection: Connection
): Record< string, DataSource > {
	return {
		db: new TypeORM( connection ),
	} as const;
}
