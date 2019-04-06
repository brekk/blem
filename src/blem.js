import memo from "fast-memoize"
import { map, curry, pipe, join, reduce, concat } from "ramda"

const isString = x => typeof x === `string`
const { isArray } = Array
const triplet = curry((condition, bCase, aCase, x) =>
  condition(x) ? aCase(x) : bCase(x)
)

const STRINGS = {
  modifier: `--`,
  element: `__`,
  space: ` `,
  empty: ``
}

export const uniq = x => [...new Set(x)]
export const neue = x => [].concat(x)
export const prepend = curry((pre, post) => `${pre}${post}`)
export const safeprepend = curry((pre, post) =>
  post ? `${pre}${post}` : STRINGS.empty
)

export const addModifier = curry((m, x) =>
  m ? [x, `${x}${safeprepend(STRINGS.modifier, m)}`] : x
)

export const forceString = x => (isString(x) ? x : STRINGS.empty)

export const bem = memo(function _bem(b, e, m) {
  return pipe(
    forceString,
    neue,
    join(STRINGS.element),
    safeprepend(STRINGS.element),
    prepend(forceString(b)),
    addModifier(forceString(m))
  )(e)
})

export const arrayWithNoStrings = x => isArray(x) && !isString(x[0])

export const first = x => x && x[0]

export const handleMany = pipe(
  reduce(concat, []),
  uniq,
  x => x.sort(),
  join(STRINGS.space)
)

export const make = memo(function _make(b) {
  return memo(function _makeElement(e, m) {
    if (m) {
      return pipe(
        neue,
        map(m2 => bem(b, e, m2)),
        triplet(arrayWithNoStrings, first, handleMany)
      )(m)
    }
    return bem(b, e)
  })
})
