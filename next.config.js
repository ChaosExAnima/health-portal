module.exports = {
	webpack( config, { defaultLoaders, isServer } ) {
		config.module.rules.push( {
			test: /\.graphql$/,
			exclude: /node_modules/,
			use: [ defaultLoaders.babel, { loader: 'graphql-let/loader' } ],
		} );

		config.module.rules.push( {
			test: /\.graphqls$/,
			exclude: /node_modules/,
			use: [ 'graphql-let/schema/loader' ],
		} );

		return config;
	},
};
