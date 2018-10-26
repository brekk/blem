'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var memo = _interopDefault(require('memoizee'));
var fUtility = require('f-utility');

var STRINGS = fUtility.freeze({
  modifier: "--",
  element: "__",
  space: " ",
  empty: ""
});
var uniq = function (x) { return [].concat( new Set(x) ); };
var neue = function (x) { return [].concat(x); };
var prepend = fUtility.curry(function (pre, post) { return ("" + pre + post); });
var safeprepend = fUtility.curry(
  function (pre, post) { return (post ? ("" + pre + post) : STRINGS.empty); }
);
var addModifier = fUtility.curry(
  function (m, x) { return (m ? [x, ("" + x + (safeprepend(STRINGS.modifier, m)))] : x); }
);
var forceString = function (x) { return (fUtility.isString(x) ? x : STRINGS.empty); };
var bem = memo(function λbem(b, e, m) {
  return fUtility.pipe(
    forceString,
    neue,
    fUtility.join(STRINGS.element),
    safeprepend(STRINGS.element),
    prepend(forceString(b)),
    addModifier(forceString(m))
  )(e)
});
var first = function (x) { return x && x[0]; };
var make = memo(function λmake(b) {
  return memo(function λmakeElement(e, m) {
    return m
      ? fUtility.pipe(
          neue,
          fUtility.map(function (m2) { return bem(b, e, m2); }),
          fUtility.triplet(
            function (x) { return fUtility.isArray(x) && !fUtility.isString(x[0]); },
            first,
            fUtility.pipe(
              fUtility.reduce(fUtility.concat, []),
              uniq,
              function (x) { return x.sort(); },
              fUtility.join(STRINGS.space)
            )
          )
        )(m)
      : bem(b, e)
  })
});

var blem = make;

module.exports = blem;
