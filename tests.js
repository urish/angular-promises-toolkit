/* License: MIT.
 * Copyright (C) 2014, Uri Shaked.
 */

/* global describe, inject, module, beforeEach, it, expect, jasmine*/

'use strict';

describe('module urish.promisesToolkit', function () {
	var $rootScope, $q, ngPromisesToolkit;

	beforeEach(module('urish.promisesToolkit'));

	beforeEach(inject(function (_$rootScope_, _$q_, _ngPromisesToolkit_) {
		$rootScope = _$rootScope_;
		$q = _$q_;
		ngPromisesToolkit = _ngPromisesToolkit_;
		jasmine.registerPromiseMatchers($rootScope);
	}));

	function spyPromise() {
		var promise = jasmine.createSpyObj('Promise', ['then']);
		promise.then.and.callFake(function () {
			return spyPromise();
		});
	}

	describe('ngPromisesToolkit service', function () {
		describe('#wrapPromise', function () {
			it('should return a promise', function () {
				var promise = spyPromise();
				expect(ngPromisesToolkit.wrapPromise(promise).then).toEqual(jasmine.any(Function));
			});
		});

		describe('#PromisePrototype', function () {
			it('should contain a then() method', function () {
				expect(ngPromisesToolkit.PromisePrototype).toEqual(jasmine.objectContaining({
					then: jasmine.any(Function)
				}));
			});

			it('should contain a catch() method', function () {
				expect(ngPromisesToolkit.PromisePrototype).toEqual(jasmine.objectContaining({
					'catch': jasmine.any(Function)
				}));
			});

			it('should contain a finally() method', function () {
				expect(ngPromisesToolkit.PromisePrototype).toEqual(jasmine.objectContaining({
					'finally': jasmine.any(Function)
				}));
			});
		});
	});

	describe('wrapped promise methods', function () {
		describe('#progress', function () {
			it('should register a callback function for notifications', function () {
				var progressValue;
				var deferred = $q.defer();
				deferred.promise.progress(function (value) {
					progressValue = value;
				});
				deferred.notify('dvoranit');
				$rootScope.$digest();
				expect(progressValue).toBe('dvoranit');
			});
		});

		describe('#forward', function () {
			it('should resolve the target deferred if the original promise has been resolved', function () {
				var original = $q.defer();
				var targetDeferred = $q.defer();
				original.promise.forward(targetDeferred);
				expect(targetDeferred.promise).not.toBeFulfilled();
				original.resolve('narkis');
				expect(targetDeferred.promise).toBeResolvedWith('narkis');
			});

			it('should reject the target deferred if the original promise has been rejected', function () {
				var original = $q.defer();
				var targetDeferred = $q.defer();
				original.promise.forward(targetDeferred);
				expect(targetDeferred.promise).not.toBeFulfilled();
				original.reject('savion');
				expect(targetDeferred.promise).toBeRejectedWith('savion');
			});

			it('should call notify on the target deferred when the original promise is notified', function () {
				var original = $q.defer();
				var targetDeferred = $q.defer();
				var notification = null;
				targetDeferred.promise.then(null, null, function (value) {
					notification = value;
				});

				original.promise.forward(targetDeferred);
				expect(notification).toBe(null);

				original.notify('harduf');
				expect(targetDeferred.promise).not.toBeFulfilled();
				expect(notification).toBe('harduf');
			});
		});

		describe('#property', function () {
			it('should extract the given property from the value the promise was resolved with', function () {
				var promise = $q.when({
					name: 'iris',
					type: 'flower',
					classification: {
						kingdom: 'Plantae',
						order: 'Asparagales',
						family: 'Iridaceae'
					}
				});
				expect(promise.property('name')).toBeResolvedWith('iris');
				expect(promise.property('classification').property('family')).toBeResolvedWith('Iridaceae');
			});
		});

		describe('#assignTo', function () {
			it('should assign the promise value to the given object property', function () {
				var target = {
					type: 'flower'
				};
				var deferred = $q.defer();
				deferred.promise.assignTo(target, 'name');
				deferred.resolve('sigalit');
				$rootScope.$digest();
				expect(target).toEqual({
					type: 'flower',
					name: 'sigalit'
				});
			});

			it('should return a promise', function () {
				expect($q.when('harzit').assignTo($rootScope, 'flower')).toBePromise();
			});
		});

		describe('#timeout', function () {
			beforeEach(function () {
				jasmine.clock().install();
			});

			it('should resolve if the original promise was resolved before the timeout expired', function () {
				var deferred = $q.defer();
				var timeoutPromise = deferred.promise.timeout(500);
				deferred.resolve('asfeset');
				expect(timeoutPromise).toBeResolvedWith('asfeset');
			});

			it('should reject if the original promise was rejected before the timeout expired', function () {
				var deferred = $q.defer();
				var timeoutPromise = deferred.promise.timeout(500);
				deferred.reject('hardal');
				expect(timeoutPromise).toBeRejectedWith('hardal');
			});

			it('should reject if the timeout expired before the promise was fulfilled', function () {
				var deferred = $q.defer();
				var timeoutPromise = deferred.promise.timeout(500);
				jasmine.clock().tick(1000);
				deferred.resolve('vered');
				expect(timeoutPromise).toBeRejectedWith(new Error('Timed out after 500 ms'));
			});

			it('should set the rejection reason to the string given in the second parameter of timeout() wrapped as an Error object', function () {
				var deferred = $q.defer();
				var timeoutPromise = deferred.promise.timeout(500, 'Request timed out');
				jasmine.clock().tick(1000);
				deferred.reject('vered');
				expect(timeoutPromise).toBeRejectedWith(new Error('Request timed out'));
			});

			it('should set the rejection reason to the non-string value given in the second parameter of timeout()', function () {
				var deferred = $q.defer();
				var timeoutPromise = deferred.promise.timeout(500, {
					reason: 'TIMEOUT'
				});
				jasmine.clock().tick(1000);
				deferred.resolve('vered');
				expect(timeoutPromise).toBeRejectedWith({
					reason: 'TIMEOUT'
				});
			});
		});
	});

	describe('extended $q service', function () {
		describe('#defer', function () {
			it('should return an object with a wrapped promise', function () {
				expect($q.defer().promise.$$promise).toBeDefined();
			});

			it('should resolve the promise when calling resolve()', function () {
				var deferred = $q.defer();
				expect(deferred.promise).not.toBeFulfilled();
				deferred.resolve('kalanit');
				expect(deferred.promise).toBeResolvedWith('kalanit');
			});

			it('should reject promises when calling reject()', function () {
				var deferred = $q.defer();
				expect(deferred.promise).not.toBeFulfilled();
				deferred.reject('rakefet');
				expect(deferred.promise).toBeRejectedWith('rakefet');
			});
		});

		describe('#reject', function () {
			it('should return a wrapped promise', function () {
				expect($q.reject('rakefet').$$promise).toBeDefined();
			});

			it('should return a rejected promise with the given reason', function () {
				expect($q.reject('rakefet')).toBeRejectedWith('rakefet');
			});
		});

		describe('#when', function () {
			it('should return a wrapped promise', function () {
				expect($q.when('kalanit').$$promise).toBeDefined();
			});

			it('should return a resolved promise with the given reason', function () {
				expect($q.when('kalanit')).toBeResolvedWith('kalanit');
			});
		});

		describe('#all', function () {
			it('should return a wrapped promise', function () {
				var promise1 = spyPromise();
				var promise2 = spyPromise();
				expect($q.all(promise1, promise2).$$promise).toBeDefined();
			});
		});
	});
});
