/* angular-promises.js / v0.1.0 / (c) 2014 Uri Shaked / MIT Licence */

(function () {
	'use strict';

	angular.module('urish.promisesToolkit', [])
		.service('ngPromisesToolkit', ['$window', '$rootScope', function ($window, $rootScope) {
			var $q;

			function wrapPromise(promise) {
				return Object.create(PromisePrototype, {
					$$promise: {
						value: promise,
						writable: false
					}
				});
			}

			var PromisePrototype = {
				then: function () {
					return wrapPromise(this.$$promise.then.apply(this.$$promise, arguments));
				},

				'catch': function() {
					return wrapPromise(this.$$promise.catch.apply(this.$$promise, arguments));
				},

				'finally': function() {
					return wrapPromise(this.$$promise.finally.apply(this.$$promise, arguments));
				},

				forward: function (deferred) {
					return this.then(function (result) {
						deferred.resolve(result);
						return result;
					}, function (error) {
						deferred.reject(error);
						return $q.reject(error);
					}, function (notification) {
						deferred.notify(notification);
						return notification;
					});
				},

				timeout: function (msec) {
					var deferred = $q.defer();
					var timer = $window.setTimeout(function () {
						$rootScope.$apply(function() {
							deferred.reject('timeout expired');
						});
					}, msec);

					this.forward(deferred).finally(function () {
						window.clearTimeout(timer);
					});
					return deferred.promise;
				},

				property: function(propertyName) {
					return this.then(function(o) {
						return o[propertyName];
					});
				},

				toScope: function(scope, propertyName) {
					return this.then(function(value) {
						scope[propertyName] = value;
					});
				}
			};

			this._init = function (_$q_) {
				$q = _$q_;
			};

			this.PromisePrototype = PromisePrototype;
			this.wrapPromise = wrapPromise;
		}])

		.config(function ($provide) {
			$provide.decorator('$q', function ($delegate, ngPromisesToolkit) {
				var originalDefer = $delegate.defer;
				$delegate.defer = function () {
					var deferred = originalDefer.apply($delegate, arguments);
					deferred.promise = ngPromisesToolkit.wrapPromise(deferred.promise);
					return deferred;
				};

				function wrapPromiseResult(fn) {
					return function () {
						return ngPromisesToolkit.wrapPromise(fn.apply($delegate, arguments));
					};
				}

				$delegate.reject = wrapPromiseResult($delegate.reject);
				$delegate.when = wrapPromiseResult($delegate.when);
				$delegate.all = wrapPromiseResult($delegate.all);
				ngPromisesToolkit._init($delegate);
				return $delegate;
			});
		});
})();
