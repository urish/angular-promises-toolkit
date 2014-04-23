/* License: MIT.
 * Copyright (C) 2014, Uri Shaked.
 */

'use strict';

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		logLevel: config.LOG_INFO,
		browsers: ['PhantomJS'],
		autoWatch: true,
		reporters: ['dots', 'coverage'],
		files: [
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'angular-promises-toolkit.js',
			'jasmine-promise-matchers.js',
			'tests.js'
		],
		preprocessors: {
			'angular-promises-toolkit.js': 'coverage'
		},
		coverageReporter: {
			type: 'lcov',
			dir: 'coverage/'
		}
	});
};
