import Provider from '../classes/provider';
import DBFactory from './factory-db';

import type { ProviderDB } from 'lib/db/types';

export default class ProviderDBFactory extends DBFactory {
	protected entities: Map< number, Provider >;

	protected newEntity( row: ProviderDB ): Provider {
		return new Provider().loadFromDB( row );
	}
}
