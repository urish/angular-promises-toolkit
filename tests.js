/* License: MIT.
 * Copyright (C) 2014, Uri Shaked.
 */

/* global describe, inject, module, beforeEach, it, expect, jasmine*/

'use strict';

describe('module urish.promisesToolkit', function () {
	var $q, ngPromisesToolkit;

	beforeEach(module('urish.promisesToolkit'));

	beforeEach(inject(function ($injector) {
		$q = $injector.get('$q');
		ngPromisesToolkit = $injector.get('ngPromisesToolkit');
	}));

	function spyPromise() {
		var promise = jasmine.createSpyObj('Promise', ['then']);
		promise.then.and.callFake(function () {
			return spyPromise();
		});
	}

	describe('ngPromises service', function () {
		describe('#wrapPromise', function () {
			it('should return a promise', function () {
				var promise = spyPromise();
				expect(ngPromisesToolkit.wrapPromise(promise).then).toEqual(jasmine.any(Function));
			});
		});

		describe('#PromisePrototype.property', function() {
			it('should contain a then() method', function() {

			});
		});
	});

	describe('extended $q service', function () {
		it('defer() should return an object with a wrapped promise', function () {
			expect($q.defer().promise.$$promise).toBeDefined();
		});

		it('reject() should return a wrapped promise', function () {
			expect($q.reject('error').$$promise).toBeDefined();
		});

		it('when() should return a wrapped promise', function () {
			expect($q.when(true).$$promise).toBeDefined();
		});

		it('all() should return a wrapped promise', function () {
			var promise1 = spyPromise();
			var promise2 = spyPromise();
			expect($q.all(promise1, promise2).$$promise).toBeDefined();
		});
	});
});
