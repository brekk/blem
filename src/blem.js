import memo from "memoizee"
import {
  isString,
  isArray,
  triplet,
  map,
  curry,
  pipe,
  join,
  reduce,
  concat,
  freeze
} from "f-utility"

const STRINGS = freeze({
  modifier: `--`,
  element: `__`,
  space: ` `,
  empty: ``
})

export const uniq = x => [...new Set(x)]
export const neue = x => [].concat(x)
export const prepend = curry((pre, post) => `${pre}${post}`)
export const safeprepend = curry(
  (pre, post) => (post ? `${pre}${post}` : STRINGS.empty)
)

export const addModifier = curry(
  (m, x) => (m ? [x, `${x}${safeprepend(STRINGS.modifier, m)}`] : x)
)

export const forceString = x => (isString(x) ? x : STRINGS.empty)

export const bem = memo(function λbem(b, e, m) {
  return pipe(
    forceString,
    neue,
    join(STRINGS.element),
    safeprepend(STRINGS.element),
    prepend(forceString(b)),
    addModifier(forceString(m))
  )(e)
})

export const first = x => x && x[0]

export const make = memo(function λmake(b) {
  return memo(function λmakeElement(e, m) {
    return m
      ? pipe(
          neue,
          map(m2 => bem(b, e, m2)),
          triplet(
            x => isArray(x) && !isString(x[0]),
            first,
            pipe(
              reduce(concat, []),
              uniq,
              x => x.sort(),
              join(STRINGS.space)
            )
          )
        )(m)
      : bem(b, e)
  })
})
