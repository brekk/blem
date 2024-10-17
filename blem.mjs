import memo from 'fast-memoize';
import { curry, pipe, join, reduce, concat, map } from 'ramda';

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

var isString = function isString(x) {
  return _typeof(x) === "string";
};
var isArray = Array.isArray;
var triplet = curry(function (condition, bCase, aCase, x) {
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
var bem = memo(function _bem(b, e, m) {
  return pipe(forceString, neue, join(STRINGS.element), safeprepend(STRINGS.element), prepend(forceString(b)), addModifier(forceString(m)))(e);
});
var arrayWithNoStrings = function arrayWithNoStrings(x) {
  return isArray(x) && !isString(x[0]);
};
var first = function first(x) {
  return x && x[0];
};
var handleMany = pipe(reduce(concat, []), uniq, function (x) {
  return x.sort();
}, join(STRINGS.space));
var make = memo(function _make(b) {
  return memo(function _makeElement(e, m) {
    if (m) {
      return pipe(neue, map(function (m2) {
        return bem(b, e, m2);
      }), triplet(arrayWithNoStrings, first, handleMany))(m);
    }
    return bem(b, e);
  });
});

var blem = make;

export { blem as default };
