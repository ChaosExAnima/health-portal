import { EntityInput } from 'lib/entities/types';

interface EntityFormProps< E extends EntityInput > {
	saved?: E;
}
