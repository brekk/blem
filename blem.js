'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var memo = _interopDefault(require('fast-memoize'));
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
var bem = memo(function _bem(b, e, m) {
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
var make = memo(function _make(b) {
  return memo(function _makeElement(e, m) {
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
