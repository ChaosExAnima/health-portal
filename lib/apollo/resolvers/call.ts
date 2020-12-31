import {
	QueryResolver,
	TypeResolver,
} from './index';
import { Call } from 'lib/db/entities';

const getCalls: QueryResolver<'getCalls'> = async ( parent, { offset, limit }, { dataSources: { db } } ) => {
	const [ calls, totalCount ] = await db.em.findAndCount( Call, {} );
	return {
		calls,
		totalCount,
		offset: offset || 0,
		limit: limit || 1000,
	};
};

const call: QueryResolver<'call'> = async ( parent, { slug }, { dataSources: { db } } ) => {
	return db.em.findOneOrFail( Call, { slug } );
};

const Resolver: TypeResolver<'Call'> = ( {
	date( parent ) {
		return parent.created;
	},
	async provider( parent, {}, { dataSources: { db } } ) {
		const parentObj = await db.em.findOneOrFail( Call, { id: parent.id }, [ 'provider' ] );
		return parentObj.provider;
	},
	async claims( parent, {}, { dataSources: { db } } ) {
		const parentObj = await db.em.findOneOrFail( Call, { id: parent.id }, [ 'claims' ] );
		return parentObj.claims.toArray();
	},
	async appeals( parent, {}, { dataSources: { db } } ) {
		const parentObj = await db.em.findOneOrFail( Call, { id: parent.id }, [ 'appeals' ] );
		return parentObj.appeals.getItems();
	},
	async note( parent, {}, { dataSources: { db } } ) {
		const parentObj = await db.em.findOneOrFail( Call, { id: parent.id }, [ 'note' ] );
		return parentObj.note;
	},
} );

export default {
	Query: { getCalls, call },
	Mutation: {},
	Resolver: { Call: Resolver },
};
