'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var memo = _interopDefault(require('fast-memoize'));
var ramda = require('ramda');

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

var isString = function isString(x) {
  return typeof x === "string";
};
var isArray = Array.isArray;
var triplet = ramda.curry(function (condition, bCase, aCase, x) {
  return condition(x) ? aCase(x) : bCase(x);
});
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
var prepend = ramda.curry(function (pre, post) {
  return "".concat(pre).concat(post);
});
var safeprepend = ramda.curry(function (pre, post) {
  return post ? "".concat(pre).concat(post) : STRINGS.empty;
});
var addModifier = ramda.curry(function (m, x) {
  return m ? [x, "".concat(x).concat(safeprepend(STRINGS.modifier, m))] : x;
});
var forceString = function forceString(x) {
  return isString(x) ? x : STRINGS.empty;
};
var bem = memo(function _bem(b, e, m) {
  return ramda.pipe(forceString, neue, ramda.join(STRINGS.element), safeprepend(STRINGS.element), prepend(forceString(b)), addModifier(forceString(m)))(e);
});
var arrayWithNoStrings = function arrayWithNoStrings(x) {
  return isArray(x) && !isString(x[0]);
};
var first = function first(x) {
  return x && x[0];
};
var handleMany = ramda.pipe(ramda.reduce(ramda.concat, []), uniq, function (x) {
  return x.sort();
}, ramda.join(STRINGS.space));
var make = memo(function _make(b) {
  return memo(function _makeElement(e, m) {
    if (m) {
      return ramda.pipe(neue, ramda.map(function (m2) {
        return bem(b, e, m2);
      }), triplet(arrayWithNoStrings, first, handleMany))(m);
    }
    return bem(b, e);
  });
});

var blem = make;

module.exports = blem;
