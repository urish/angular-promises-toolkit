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
						Family: 'Iridaceae'
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
