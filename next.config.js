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

		if ( process.env.ANALYZE ) {
			const {
				BundleAnalyzerPlugin,
			} = require( 'webpack-bundle-analyzer' );
			config.plugins.push(
				new BundleAnalyzerPlugin( {
					analyzerMode: 'static',
					reportFilename: isServer
						? '../analyze/server.html'
						: './analyze/client.html',
				} )
			);
		}

		return config;
	},
};
