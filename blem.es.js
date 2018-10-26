import memo from 'memoizee';
import { isString, isArray, triplet, map, curry, pipe, join, reduce, concat, freeze } from 'f-utility';

var STRINGS = freeze({
  modifier: "--",
  element: "__",
  space: " ",
  empty: ""
});
var uniq = function (x) { return [].concat( new Set(x) ); };
var neue = function (x) { return [].concat(x); };
var prepend = curry(function (pre, post) { return ("" + pre + post); });
var safeprepend = curry(
  function (pre, post) { return (post ? ("" + pre + post) : STRINGS.empty); }
);
var addModifier = curry(
  function (m, x) { return (m ? [x, ("" + x + (safeprepend(STRINGS.modifier, m)))] : x); }
);
var forceString = function (x) { return (isString(x) ? x : STRINGS.empty); };
var bem = memo(function λbem(b, e, m) {
  return pipe(
    forceString,
    neue,
    join(STRINGS.element),
    safeprepend(STRINGS.element),
    prepend(forceString(b)),
    addModifier(forceString(m))
  )(e)
});
var first = function (x) { return x && x[0]; };
var make = memo(function λmake(b) {
  return memo(function λmakeElement(e, m) {
    return m
      ? pipe(
          neue,
          map(function (m2) { return bem(b, e, m2); }),
          triplet(
            function (x) { return isArray(x) && !isString(x[0]); },
            first,
            pipe(
              reduce(concat, []),
              uniq,
              function (x) { return x.sort(); },
              join(STRINGS.space)
            )
          )
        )(m)
      : bem(b, e)
  })
});

var blem = make;

export default blem;
