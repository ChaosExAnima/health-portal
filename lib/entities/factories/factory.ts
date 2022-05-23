import type Entity from '../classes/entity';

export default abstract class Factory implements Iterable< Entity > {
	protected entities = new Map< number, Entity >();

	/**
	 * Gets the first entity.
	 * @returns Entity | undefined
	 */
	public first(): Entity | undefined {
		const [ firstKey ] = this.entities.keys();
		return this.entities.get( firstKey );
	}

	/**
	 * Iterates over entities.
	 * @returns Entity
	 */
	public [ Symbol.iterator ]() {
		return this.entities.values();
	}

	/**
	 * Utility to array function.
	 * @returns Entity[]
	 */
	public toArray(): Entity[] {
		return Array.from( this.entities.values() );
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

	/**
	 * Getters
	 */

	public get length(): number {
		return this.entities.size;
	}

	public get ids(): number[] {
		return Array.from( this.entities.keys() );
	}
}
