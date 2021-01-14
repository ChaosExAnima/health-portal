import { AnyEntity, Collection, MikroORM } from '@mikro-orm/core';
import { DataSource } from 'apollo-datasource';
import DataLoader from 'dataloader';

export default abstract class WithDataLoader<T> extends DataSource {
	protected readonly orm: MikroORM;
	public readonly dataLoader: DataLoader<number, T>

	protected readonly refColumns: Readonly<Array<keyof T>>;
	protected readonly collectionMap: Map<keyof T, DataLoader<number, unknown>>;

	constructor( orm: MikroORM ) {
		super();
		this.orm = orm;
		this.dataLoader = new DataLoader( this.batchLoad.bind( this ) );
		this.collectionMap = new Map( this.refColumns.map(
			( key ) => [ key, new DataLoader<number, unknown>( this.batchCollectionLoad( key ) ) ]
		) );
	}

	abstract batchLoad( keys: number[], collection?: keyof T ): Promise<T[]>;

	load( id?: number ): Promise<T | null> {
		if ( ! id ) {
			return Promise.resolve( null );
		}
		return this.dataLoader.load( id );
	}

	loadOrFail( id?: number ): Promise<T> {
		if ( ! id ) {
			throw new Error( 'Loading failed due to missing ID.' );
		}
		return this.dataLoader.load( id );
	}

	loadCollection<C extends AnyEntity>( parentId: number, column: keyof T ): Promise<C[]> {
		if ( ! this.collectionMap.has( column ) ) {
			this.collectionMap.set( column, new DataLoader<number, C[]>( this.batchCollectionLoad.bind( this, column ) ) );
		}
		const collection = this.collectionMap.get( column ) as DataLoader<number, C>;

		return collection.load( parentId );
	}

	protected batchCollectionLoad<C extends AnyEntity>( column: keyof T ) {
		return async ( keys: number[] ): Promise<C> => {
			const parents = await this.batchLoad( keys, column );
			return parents.map( ( parent ) => ( parent[ column ] as Collection<C, T> ).toArray() );
		};
	}
}
