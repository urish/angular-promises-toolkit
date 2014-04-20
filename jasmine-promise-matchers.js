/* jasmine-promise-matchers.js Custom promise matchers for Jasmine 2.0 / (c) 2014 Uri Shaked / MIT Licence */

/* global jasmine */

jasmine.registerPromiseMatchers = function ($rootScope) {
	'use strict';

	var jasmine = this;
	var prettyPrint = jasmine.pp;

	function isPromise(value) {
		return (typeof value === 'object') && (typeof value.then === 'function');
	}

	function getPromiseValue(promise) {
		var result = {
			resolved: false,
			rejected: false
		};
		promise.then(function (value) {
			result.resolved = true;
			result.value = value;
		}, function (value) {
			result.rejected = true;
			result.value = value;
		});
		$rootScope.$digest();

		return result;
	}

	function makePromiseMatcher(options) {
		return function (util, customEqualityTesters) {
			return {
				compare: function (actual, expected) {
					var result = {
						pass: false
					};

					if (!isPromise(actual)) {
						result.message = 'Expected ' + prettyPrint(actual) + ' to be a promise';
						return result;
					}

					var promiseInfo = getPromiseValue(actual);
					var expectName = options.resolved ? 'resolved' : 'rejected';
					if (!promiseInfo.resolved && !promiseInfo.rejected) {
						result.message = 'Expected ' + prettyPrint(actual) + ' to be ' + expectName + ', but it was not fulfilled yet';
						return result;
					}

					if (options.resolved && promiseInfo.rejected) {
						result.message = 'Expected ' + prettyPrint(actual) + ' to be resolved, but it was rejected';
						return result;
					}

					if (!options.resolved && promiseInfo.resolved) {
						result.message = 'Expected ' + prettyPrint(actual) + ' to be rejected, but it was resolved';
						return result;
					}

					if (!options.checkValue) {
						result.pass = true;
						result.message = 'Expected ' + prettyPrint(actual) + ' not to be ' + expectName;
						return result;
					}

					if (util.equals(promiseInfo.value, expected, customEqualityTesters)) {
						result.pass = true;
						result.message = 'Expected ' + prettyPrint(actual) + ' not to be ' + expectName + ' with ' + prettyPrint(expected);
					} else {
						result.message = 'Expected ' + prettyPrint(actual) + ' to be ' + expectName + ' with ' + prettyPrint(expected) + ', but it was ' + expectName + ' with ' + prettyPrint(promiseInfo.value);
					}

					return result;
				}
			};
		};
	}

	jasmine.addMatchers({
		toBePromise: function () {
			return {
				compare: function (actual) {
					return {
						pass: isPromise(actual)
					};
				}
			};
		},

		toBeResolved: makePromiseMatcher({
			resolved: true,
			hasValue: false
		}),

		toBeResolvedWith: makePromiseMatcher({
			resolved: true,
			hasValue: true
		}),

		toBeRejected: makePromiseMatcher({
			resolved: false,
			hasValue: false
		}),

		toBeRejectedWith: makePromiseMatcher({
			resolved: false,
			hasValue: true
		}),

		toBeFulfilled: function () {
			return {
				compare: function (actual) {
					var result = {
						pass: false
					};

					if (!isPromise(actual)) {
						result.message = 'Expected ' + prettyPrint(actual) + ' to be a promise';
						return result;
					}

					var promiseInfo = getPromiseValue(actual);
					if (promiseInfo.resolved || promiseInfo.rejected) {
						result.pass = true;
						result.message = 'Expected ' + prettyPrint(actual) + ' not to be fulfilled';
					} else {
						result.message = 'Expected ' + prettyPrint(actual) + ' to be fulfilled';
					}
					return result;
				}
			};
		}
	});
};
