import type { DBCommonFields } from 'lib/db/types';
import type { EntityInput } from 'lib/entities/types';

export default abstract class Entity {
	public id = 0;
	public created = new Date();
	public slug?: string;

	public loadFromForm( input: EntityInput ) {
		Object.assign( this, input );
		return this;
	}

	public loadFromDB( { id, created }: DBCommonFields ) {
		this.id = id;
		this.created = created;
		return this;
	}

	protected getOrThrow( key: keyof this ): any {
		if ( this[ key ] === undefined ) {
			throw new Error( 'Tried to access undefined property' );
		}
		return this[ key ];
	}
}
