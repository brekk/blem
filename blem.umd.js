(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.blem = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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

  var PLACEHOLDER = "🍛";
  var bindInternal3 = function bindInternal3(func, thisContext) {
    return function (a, b, c) {
      return func.call(thisContext, a, b, c);
    };
  };
  var some$1 = function fastSome(subject, fn, thisContext) {
    var length = subject.length,
        iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
        i;
    for (i = 0; i < length; i++) {
      if (iterator(subject[i], i, subject)) {
        return true;
      }
    }
    return false;
  };
  var curry = function curry(fn) {
    var test = function test(x) {
      return x === PLACEHOLDER;
    };
    return function curried() {
      var arguments$1 = arguments;
      var argLength = arguments.length;
      var args = new Array(argLength);
      for (var i = 0; i < argLength; ++i) {
        args[i] = arguments$1[i];
      }
      var countNonPlaceholders = function countNonPlaceholders(toCount) {
        var count = toCount.length;
        while (!test(toCount[count])) {
          count--;
        }
        return count;
      };
      var length = some$1(args, test) ? countNonPlaceholders(args) : args.length;
      function saucy() {
        var arguments$1 = arguments;
        var arg2Length = arguments.length;
        var args2 = new Array(arg2Length);
        for (var j = 0; j < arg2Length; ++j) {
          args2[j] = arguments$1[j];
        }
        return curried.apply(this, args.map(function (y) {
          return test(y) && args2[0] ? args2.shift() : y;
        }).concat(args2));
      }
      return length >= fn.length ? fn.apply(this, args) : saucy;
    };
  };
  var innerpipe = function innerpipe(args) {
    return function (x) {
      var first = args[0];
      var rest = args.slice(1);
      var current = first(x);
      for (var a = 0; a < rest.length; a++) {
        current = rest[a](current);
      }
      return current;
    };
  };
  function pipe() {
    var arguments$1 = arguments;
    var argLength = arguments.length;
    var args = new Array(argLength);
    for (var i = 0; i < argLength; ++i) {
      args[i] = arguments$1[i];
    }
    return innerpipe(args);
  }
  var prop = curry(function (property, o) {
    return o && property && o[property];
  });
  var _keys = Object.keys;
  var keys = _keys;
  var propLength = prop("length");
  var objectLength = pipe(keys, propLength);
  var delegatee = curry(function (method, arg, x) {
    return x[method](arg);
  });
  var filter = delegatee("filter");

  var entrust0 = function entrust0(fn, x) {
    return x[fn]();
  };
  var e0 = curry(entrust0);
  var entrust1 = function entrust1(fn, a, x) {
    return x[fn](a);
  };
  var e1 = curry(entrust1);
  var entrust2 = function entrust2(fn, a, b, x) {
    return x[fn](a, b);
  };
  var e2 = curry(entrust2);

  var flatten = function flatten(a) {
    return a.reduce(function (x, y) {
      return x.concat(y);
    });
  };
  var flatMap = function flatMap(a
  , f
  ) {
    return !f ? flatten(a) : flatten(a.map(f));
  };
  var flatmapFast = flatMap;

  var random = function random(x) {
    if (x === void 0) x = 1;
    return Math.round(Math.random() * x);
  };
  var floor = function floor(x) {
    return Math.floor(Math.random() * x);
  };
  var floorMin = curry(function (min, x) {
    return floor(x) + min;
  });
  var f =
  Object.freeze({
    floor: floor,
    floorMin: floorMin
  });
  var __iterate = function __iterate(total, fn) {
    var count = total;
    var agg = [];
    if (typeof fn !== "function" || typeof count !== "number") {
      return agg;
    }
    while (count > 0) {
      count--;
      agg.push(fn());
    }
    return agg;
  };
  var iterate = curry(__iterate);
  var keys$1 = Object.keys;
  var take = curry(function (encase, o) {
    var obj;
    if (o && o[0] && o.length) {
      var found = floor(o.length);
      var selection = o[found];
      return !encase ? selection : [selection];
    }
    var ks = keys$1(o);
    var index = floor(ks.length);
    var key = ks[index];
    var value = o[key];
    return !encase ? value : (obj = {}, obj[key] = value, obj);
  });
  var pick = take(false);
  var grab = take(true);
  var allot = curry(function (howMany, ofThing) {
    return iterate(howMany, function () {
      return grab(ofThing);
    });
  });
  var t =
  Object.freeze({
    take: take,
    pick: pick,
    grab: grab,
    allot: allot
  });
  var bindInternal3$1 = function bindInternal3(func, thisContext) {
    return function (a, b, c) {
      return func.call(thisContext, a, b, c);
    };
  };
  var filter$1 = function fastFilter(subject, fn, thisContext) {
    var length = subject.length,
        result = [],
        iterator = thisContext !== undefined ? bindInternal3$1(fn, thisContext) : fn,
        i;
    for (i = 0; i < length; i++) {
      if (iterator(subject[i], i, subject)) {
        result.push(subject[i]);
      }
    }
    return result;
  };
  var filter$1$1 = function fastFilterObject(subject, fn, thisContext) {
    var keys = Object.keys(subject),
        length = keys.length,
        result = {},
        iterator = thisContext !== undefined ? bindInternal3$1(fn, thisContext) : fn,
        i,
        key;
    for (i = 0; i < length; i++) {
      key = keys[i];
      if (iterator(subject[key], key, subject)) {
        result[key] = subject[key];
      }
    }
    return result;
  };
  var filter$2 = function fastFilter(subject, fn, thisContext) {
    if (subject instanceof Array) {
      return filter$1(subject, fn, thisContext);
    } else {
      return filter$1$1(subject, fn, thisContext);
    }
  };
  var has = function has(x, y) {
    return !!y[x];
  };
  var isArray = Array.isArray;
  var __willDelegate = function __willDelegate(method, functor) {
    return has(method, functor) && !isArray(functor);
  };
  function __delegateFastBinary(method, fast, fn, functor) {
    return __willDelegate(method, functor) ? functor[method](fn) : fast(functor, fn);
  }
  var delegateFastBinary = curry(__delegateFastBinary);
  function __delegateFastTertiary(method, fast, fn, initial, functor) {
    return __willDelegate(method, functor) ? functor[method](fn, initial) : fast(functor, fn, initial);
  }
  var delegateFastTertiary = curry(__delegateFastTertiary);
  var filter$3 = delegateFastBinary("filter", filter$2);
  var join = e1("join");
  var concat = e1("concat");
  var __relativeIndex = function __relativeIndex(length, index) {
    return index > -1 ? index : length - Math.abs(index);
  };
  var relativeIndex = curry(__relativeIndex);
  var __alterIndex = function __alterIndex(index, fn, input) {
    var i = relativeIndex(input.length, index);
    var copy = [].concat(input);
    copy[i] = fn(copy[i]);
    return copy;
  };
  var alterIndex = curry(__alterIndex);
  var alterFirstIndex = alterIndex(0);
  var alterLastIndex = alterIndex(-1);
  var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  var wordSource = curry(function (source, howLong) {
    return pipe(allot(howLong), join(""))(source);
  });
  var word = function word(x) {
    if (x === void 0) x = 5;
    return wordSource(alphabet, x);
  };
  var w =
  Object.freeze({
    wordSource: wordSource,
    word: word
  });
  var shuffle = function shuffle(list) {
    var newList = [].concat(list);
    var start = newList.length;
    while (start-- > 0) {
      var index = Math.floor(Math.random() * start + 1);
      var current = newList[index];
      var newer = newList[start];
      newList[index] = newer;
      newList[start] = current;
    }
    return newList;
  };
  var s =
  Object.freeze({
    shuffle: shuffle
  });
  var flip = function flip(fn) {
    return curry(function (a, b) {
      return fn(b, a);
    });
  };
  var fork = e2("fork");
  var map = function fastMap(subject, fn, thisContext) {
    var length = subject.length,
        result = new Array(length),
        iterator = thisContext !== undefined ? bindInternal3$1(fn, thisContext) : fn,
        i;
    for (i = 0; i < length; i++) {
      result[i] = iterator(subject[i], i, subject);
    }
    return result;
  };
  var map$1 = function fastMapObject(subject, fn, thisContext) {
    var keys = Object.keys(subject),
        length = keys.length,
        result = {},
        iterator = thisContext !== undefined ? bindInternal3$1(fn, thisContext) : fn,
        i,
        key;
    for (i = 0; i < length; i++) {
      key = keys[i];
      result[key] = iterator(subject[key], key, subject);
    }
    return result;
  };
  var map$2 = function fastMap(subject, fn, thisContext) {
    if (subject instanceof Array) {
      return map(subject, fn, thisContext);
    } else {
      return map$1(subject, fn, thisContext);
    }
  };
  var __map = function __map(fn, functor) {
    if (functor && !Array.isArray(functor) && functor.map) {
      return functor.map(fn);
    }
    return map$2(functor, fn);
  };
  var map$3 = curry(__map);
  var __isTypeof = function __isTypeof(type, x) {
    return type === _typeof(x);
  };
  var isTypeof = curry(__isTypeof);
  var isBoolean = isTypeof("boolean");
  var isNumber = isTypeof("number");
  var isFunction = isTypeof("function");
  var isString = isTypeof("string");
  var isObject = isTypeof("object");
  var isArray$1 = Array.isArray;
  var bindInternal4 = function bindInternal4(func, thisContext) {
    return function (a, b, c, d) {
      return func.call(thisContext, a, b, c, d);
    };
  };
  var reduce = function fastReduce(subject, fn, initialValue, thisContext) {
    var length = subject.length,
        iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
        i,
        result;
    if (initialValue === undefined) {
      i = 1;
      result = subject[0];
    } else {
      i = 0;
      result = initialValue;
    }
    for (; i < length; i++) {
      result = iterator(result, subject[i], i, subject);
    }
    return result;
  };
  var reduce$1 = function fastReduceObject(subject, fn, initialValue, thisContext) {
    var keys = Object.keys(subject),
        length = keys.length,
        iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
        i,
        key,
        result;
    if (initialValue === undefined) {
      i = 1;
      result = subject[keys[0]];
    } else {
      i = 0;
      result = initialValue;
    }
    for (; i < length; i++) {
      key = keys[i];
      result = iterator(result, subject[key], key, subject);
    }
    return result;
  };
  var reduce$2 = function fastReduce(subject, fn, initialValue, thisContext) {
    if (subject instanceof Array) {
      return reduce(subject, fn, initialValue, thisContext);
    } else {
      return reduce$1(subject, fn, initialValue, thisContext);
    }
  };
  var reduce$3 = delegateFastTertiary("reduce", reduce$2);
  var fold = e2("fold");
  var chain = delegateFastBinary("chain", flatmapFast);
  var trim = e0("trim");
  var charAt = e1("charAt");
  var codePointAt = e1("codePointAt");
  var match = e1("match");
  var repeat = e1("repeat");
  var search = e1("search");
  var split = e1("split");
  var endsWithLength = e2("endsWith");
  var indexOfFromIndex = e2("indexOf");
  var lastIndexOfFromIndex = e2("lastIndexOf");
  var padEnd = e2("padEnd");
  var padStart = e2("padStart");
  var replace = e2("replace");
  var startsWithFromPosition = e2("startsWith");
  var substr = e2("substr");
  var __triplet = function __triplet(cnFn, bFn, aFn, o) {
    return cnFn(o) ? aFn(o) : bFn(o);
  };
  var triplet = curry(__triplet);
  var _keys$1 = Object.keys;
  var _assign$1 = Object.assign;
  var keys$1$1 = _keys$1;
  var assign$1 = _assign$1;
  var entries = function entries(o) {
    return pipe(keys$1$1, map$3(function (k) {
      return [k, o[k]];
    }))(o);
  };
  var toPairs = entries;
  var fromPairs = reduce$3(function (agg, ref) {
    var obj;
    var k = ref[0];
    var v = ref[1];
    return merge$1(agg, (obj = {}, obj[k] = v, obj));
  }, {});
  var __pairwise = function __pairwise(hoc, fn, o) {
    return pipe(toPairs, hoc(fn))(o);
  };
  var pairwise = curry(__pairwise);
  var __pairwiseObject = function __pairwiseObject(hoc, fn, o) {
    return pipe(pairwise(hoc, fn), fromPairs)(o);
  };
  var pairwiseObject = curry(__pairwiseObject);
  var mapTuples = pairwiseObject(map$3);
  var __merge = function __merge(a, b) {
    return entries(a).concat(entries(b)).reduce(function (hash, ref) {
      var obj;
      var k = ref[0];
      var v = ref[1];
      return k !== "__proto__" ? assign$1(hash, (obj = {}, obj[k] = v, obj)) : hash;
    }, {});
  };
  var merge$1 = curry(__merge);
  var __pathOr = function __pathOr(def, lenses, input) {
    return reduce$3(function (focus, lens) {
      return focus[lens] || def;
    }, input, lenses);
  };
  var pathOr = curry(__pathOr);
  var path = pathOr(null);
  var __propOr = function __propOr(def, property, input) {
    return pathOr(def, [property], input);
  };
  var propOr = curry(__propOr);
  var prop$1 = propOr(null);
  var propLength$1 = prop$1("length");
  var objectLength$1 = pipe(keys$1$1, propLength$1);
  var some = function fastSome(subject, fn, thisContext) {
    var length = subject.length,
        iterator = thisContext !== undefined ? bindInternal3$1(fn, thisContext) : fn,
        i;
    for (i = 0; i < length; i++) {
      if (iterator(subject[i], i, subject)) {
        return true;
      }
    }
    return false;
  };
  var every = function fastEvery(subject, fn, thisContext) {
    var length = subject.length,
        iterator = thisContext !== undefined ? bindInternal3$1(fn, thisContext) : fn,
        i;
    for (i = 0; i < length; i++) {
      if (!iterator(subject[i], i, subject)) {
        return false;
      }
    }
    return true;
  };
  var keys$2 = Object.keys;
  var __which = function __which(compare, fn, o) {
    var arecomp = flip(compare);
    return triplet(Array.isArray, arecomp(fn), pipe(keys$2, arecomp(function (key) {
      return fn(o[key], key);
    })), o);
  };
  var which = curry(__which);
  var some$1$1 = which(some);
  var every$1 = which(every);
  var random$1 = Object.assign(random, f, t, w, s);

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
  var prepend = curry(function (pre, post) {
    return "".concat(pre).concat(post);
  });
  var safeprepend = curry(function (pre, post) {
    return post ? "".concat(pre).concat(post) : STRINGS.empty;
  });
  var addModifier = curry(function (m, x) {
    return m ? [x, "".concat(x).concat(safeprepend(STRINGS.modifier, m))] : x;
  });
  var forceString = function forceString(x) {
    return isString(x) ? x : STRINGS.empty;
  };
  var bem = src(function _bem(b, e, m) {
    return pipe(forceString, neue, join(STRINGS.element), safeprepend(STRINGS.element), prepend(forceString(b)), addModifier(forceString(m)))(e);
  });
  var arrayWithNoStrings = function arrayWithNoStrings(x) {
    return isArray$1(x) && !isString(x[0]);
  };
  var first = function first(x) {
    return x && x[0];
  };
  var handleMany = pipe(reduce$3(concat, []), uniq, function (x) {
    return x.sort();
  }, join(STRINGS.space));
  var make = src(function _make(b) {
    return src(function _makeElement(e, m) {
      if (m) {
        return pipe(neue, map$3(function (m2) {
          return bem(b, e, m2);
        }), triplet(arrayWithNoStrings, first, handleMany))(m);
      }
      return bem(b, e);
    });
  });

  var blem = make;

  return blem;

})));
