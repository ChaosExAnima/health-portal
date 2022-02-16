module.exports = {
	extends: [ 'next', 'plugin:prettier/recommended' ],
	plugins: [ 'jest' ],
	rules: {
		'no-unused-vars': 'off',
		'no-console': 'warn',
		'@wordpress/no-unused-vars-before-return': 'off',
		'@wordpress/no-global-event-listener': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'react/display-name': 'off',
		'prettier/prettier': 'warn',
		'jest/no-disabled-tests': 'off',
	},
};
