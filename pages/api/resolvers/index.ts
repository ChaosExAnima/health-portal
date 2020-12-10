export const resolvers = {
	Query: {
		getUsers: async () => {
			return [
				{
					id: 1,
					login: 'foo',
					avatar_url: 'bar.jpg',
				},
			];
		},
		getUser: async () => {
			return {
				id: 1,
				login: 'foo',
				avatar_url: 'bar.jpg',
			};
		},
	},
};
