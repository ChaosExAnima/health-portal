import type Entity from '../classes/entity';

export default abstract class Factory implements Iterable< Entity > {
	protected entities: Entity[] = [];

	public get length(): number {
		return this.entities.length;
	}

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
}
