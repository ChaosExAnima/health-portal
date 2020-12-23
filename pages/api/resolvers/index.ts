import type { IResolvers } from 'apollo-server-micro';

export const resolvers: IResolvers = {
	EventLink: {
		__resolveType( obj: { claim?: string; callId?: string } ): string {
			if ( obj.claim ) {
				return 'Claim';
			}
			if ( obj.callId ) {
				return 'Call';
			}
			return 'Dispute';
		},
	},
};
