import { Knex } from 'knex';

export async function extractCount(
	key: string,
	query: Knex.QueryBuilder
): Promise< number | null > {
	const result = await query.count( key, { as: 'count' } ).first();
	return result ? ( result.count as number ) : null;
}

export async function extractSum(
	key: string,
	query: Knex.QueryBuilder
): Promise< number | null > {
	const result = await query.sum( key, { as: key } ).first();
	return result ? ( result[ key ] as number ) : null;
}
