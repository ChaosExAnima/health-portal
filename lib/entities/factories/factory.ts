import type Entity from '../classes/entity';

export default abstract class Factory implements Iterable< Entity > {
	protected entities: Entity[] = [];

	public get length(): number {
		return this.entities.length;
	}

	/**
	 * Gets the first entity.
	 * @returns Entity | undefined
	 */
	public first(): Entity | undefined {
		return this.entities[ 0 ];
	}

	/**
	 * Iterates over entities.
	 * @returns Entity
	 */
	public [ Symbol.iterator ]() {
		let index = 0;
		return {
			next: (): IteratorResult< Entity > => {
				if ( index < this.entities.length ) {
					return { value: this.entities[ index++ ], done: false };
				}
				return { value: null, done: true };
			},
		};
	}

	/**
	 * Loads the data from the store.
	 * @returns Promise
	 */
	public abstract load(): Promise< this >;

	/**
	 * Transforms raw data into the expected entity.
	 * @param raw Raw entity.
	 */
	protected abstract newEntity( raw: any ): Entity; // eslint-disable-line no-unused-vars
}
