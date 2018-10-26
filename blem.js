'use strict';

var fUtility = require('f-utility');

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function memoize(fn, options) {
  var cache = options && options.cache ? options.cache : cacheDefault;
  var serializer = options && options.serializer ? options.serializer : serializerDefault;
  var strategy = options && options.strategy ? options.strategy : strategyDefault;
  return strategy(fn, {
    cache: cache,
    serializer: serializer
  });
}
function isPrimitive(value) {
  return value == null || typeof value === 'number' || typeof value === 'boolean';
}
function monadic(fn, cache, serializer, arg) {
  var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
  var computedValue = cache.get(cacheKey);
  if (typeof computedValue === 'undefined') {
    computedValue = fn.call(this, arg);
    cache.set(cacheKey, computedValue);
  }
  return computedValue;
}
function variadic(fn, cache, serializer) {
  var args = Array.prototype.slice.call(arguments, 3);
  var cacheKey = serializer(args);
  var computedValue = cache.get(cacheKey);
  if (typeof computedValue === 'undefined') {
    computedValue = fn.apply(this, args);
    cache.set(cacheKey, computedValue);
  }
  return computedValue;
}
function assemble(fn, context, strategy, cache, serialize) {
  return strategy.bind(context, fn, cache, serialize);
}
function strategyDefault(fn, options) {
  var strategy = fn.length === 1 ? monadic : variadic;
  return assemble(fn, this, strategy, options.cache.create(), options.serializer);
}
function strategyVariadic(fn, options) {
  var strategy = variadic;
  return assemble(fn, this, strategy, options.cache.create(), options.serializer);
}
function strategyMonadic(fn, options) {
  var strategy = monadic;
  return assemble(fn, this, strategy, options.cache.create(), options.serializer);
}
function serializerDefault() {
  return JSON.stringify(arguments);
}
function ObjectWithoutPrototypeCache() {
  this.cache = Object.create(null);
}
ObjectWithoutPrototypeCache.prototype.has = function (key) {
  return key in this.cache;
};
ObjectWithoutPrototypeCache.prototype.get = function (key) {
  return this.cache[key];
};
ObjectWithoutPrototypeCache.prototype.set = function (key, value) {
  this.cache[key] = value;
};
var cacheDefault = {
  create: function create() {
    return new ObjectWithoutPrototypeCache();
  }
};
var src = memoize;
var strategies = {
  variadic: strategyVariadic,
  monadic: strategyMonadic
};
src.strategies = strategies;

var STRINGS = {
  modifier: "--",
  element: "__",
  space: " ",
  empty: ""
};
var uniq = function uniq(x) {
  return _toConsumableArray(new Set(x));
};
var neue = function neue(x) {
  return [].concat(x);
};
var prepend = fUtility.curry(function (pre, post) {
  return "".concat(pre).concat(post);
});
var safeprepend = fUtility.curry(function (pre, post) {
  return post ? "".concat(pre).concat(post) : STRINGS.empty;
});
var addModifier = fUtility.curry(function (m, x) {
  return m ? [x, "".concat(x).concat(safeprepend(STRINGS.modifier, m))] : x;
});
var forceString = function forceString(x) {
  return fUtility.isString(x) ? x : STRINGS.empty;
};
var bem = src(function _bem(b, e, m) {
  return fUtility.pipe(forceString, neue, fUtility.join(STRINGS.element), safeprepend(STRINGS.element), prepend(forceString(b)), addModifier(forceString(m)))(e);
});
var arrayWithNoStrings = function arrayWithNoStrings(x) {
  return fUtility.isArray(x) && !fUtility.isString(x[0]);
};
var first = function first(x) {
  return x && x[0];
};
var handleMany = fUtility.pipe(fUtility.reduce(fUtility.concat, []), uniq, function (x) {
  return x.sort();
}, fUtility.join(STRINGS.space));
var make = src(function _make(b) {
  return src(function _makeElement(e, m) {
    if (m) {
      return fUtility.pipe(neue, fUtility.map(function (m2) {
        return bem(b, e, m2);
      }), fUtility.triplet(arrayWithNoStrings, first, handleMany))(m);
    }
    return bem(b, e);
  });
});

var blem = make;

module.exports = blem;
