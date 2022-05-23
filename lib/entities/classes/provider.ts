import { ProviderDB } from 'lib/db/types';

import Claim from './claim';
import Entity from './entity';

export default class Provider extends Entity {
	public name: string;
	public address?: string;
	public phone?: string;
	public email?: string;
	public website?: string;

	public claims: Claim[] = [];

	public loadFromDB( row: ProviderDB ): this {
		Object.assign( this, row );
		return super.loadFromDB( row );
	}
}
