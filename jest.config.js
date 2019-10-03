module.exports = {
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json',
			diagnostics: {
				pathRegex: /\.(spec|test)\.ts$/
			}
		}
	},
	moduleFileExtensions: [
		'ts',
		'js',
		'json'
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	testMatch: [
		'**/test/**/*.test.(ts|js)'
	],
	testEnvironment: 'node'
};
