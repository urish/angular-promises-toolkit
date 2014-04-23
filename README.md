angular-promises-toolkit
==============

Extend angular.js promises with useful methods.

Copyright (C) 2014, Uri Shaked <uri@urish.org>

[![Build Status](https://travis-ci.org/urish/angular-promises-toolkit.png?branch=master)](https://travis-ci.org/urish/angular-promises-toolkit)
[![Coverage Status](https://coveralls.io/repos/urish/angular-promises-toolkit/badge.png)](https://coveralls.io/r/urish/angular-promises-toolkit)

Installation
------------

You can choose your preferred method of installation:
* Through bower: `bower install angular-promises-toolkit --save`
* Through npm: `npm install angular-promises-toolkit --save`
* Download from github: [promises-toolkit.min.js](https://raw.github.com/urish/angular-promises-toolkit/master/angular-promises-toolkit.min.js)

Usage
-----
Include both angular-promises-toolkit in your application.

```html
<script src="bower_components/angular-promises-toolkit/angular-promises-toolkit.js"></script>
```

Add the module `urish.promisesToolkit` as a dependency to your app module:

```js
var myapp = angular.module('myapp', ['urish.promisesToolkit']);
```

### New Promise Methods

Once you have included angular-promises-toolkit in your projects, all the promises will automatically
have the following methods:

#### promise.progress(onProgress)
A sugar method, equivalent to `promise.then(undefined, undefined, onProgress)`.

#### promise.timeout(ms, message)
Returns a promise that will have the same result as `promise`, except that if promise is not fulfilled
or rejected before `ms` milliseconds, the returned promise will be rejected with an `Error` with the given
`message`. If `message` is not supplied, the message will be `"Timed out after " + ms + " ms"`.

#### promise.forward(deferred)
TODO Documentation

#### promise.property(name)
TODO Documentation

#### promise.assignTo(object, propertyName)
TODO documentation

Many of the above methods were inspired by the [Q library](https://github.com/kriskowal/q), and
some of the documentation is based on Q's documentation.

License
----

Released under the terms of MIT License:

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


