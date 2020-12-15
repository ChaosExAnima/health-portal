export function claimType( type: string ): string {
	const types: Record<string, string> = {
		DENTAL: 'Dental',
		OUTOFNETWORK: 'Out of Network',
		INNETWORK: 'In Network',
		PHARMACY: 'Pharmacy',
	} as const;
	return types[ type ] || 'Unknown';
}

export function claimStatus( status: string ): string {
	const statuses: Record<string, string> = {
		PENDING: 'Pending',
		APPROVED: 'Approved',
		DENIED: 'Denied',
		DELETED: 'Deleted',
	} as const;
	return statuses[ status ] || 'Unknown';
}
