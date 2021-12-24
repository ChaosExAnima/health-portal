import { Nullable } from 'global-types';
import { CLAIM_STATUS_TYPE, CLAIM_TYPES_TYPE } from 'lib/constants';

type RawData = Record< string, string >;

type RawClaim = {
	number: string;
	created: Date;
	providerName: Nullable< string >;
	type: CLAIM_TYPES_TYPE;
	status: CLAIM_STATUS_TYPE;
	billed: number;
	cost: number;
};
