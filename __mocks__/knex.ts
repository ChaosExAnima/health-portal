export const queryBuilder = {
	where: jest.fn().mockReturnThis(),
	first: jest.fn().mockReturnThis(),
};

export default jest.fn( () => {
	return jest.fn( () => queryBuilder );
} );
