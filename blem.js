const memo = require('memoizee')
const {
  map,
  curry,
  pipe,
  join,
  reduce,
  concat,
  freeze
} = require('f-utility')

const STRINGS = freeze({
  modifier: `--`,
  element: `__`,
  space: ` `,
  empty: ``
})

const uniq = x => [...new Set(x)]
const neue = x => [].concat(x)
// const prepend = curry(
//   (pre, post) => `${pre}${post}`
// )
const safeprepend = curry(
  (pre, post) => (
    post
    ? `${pre}${post}`
    : STRINGS.empty
  )
)

const addModifier = curry(
  (m, x) => (
    m
    ? [x, `${x}${safeprepend(STRINGS.modifier, m)}`]
    : x
  )
)

const bem = memo(
  function λbem(b, e, m) {
    return pipe(
      neue,
      join(STRINGS.element),
      safeprepend(STRINGS.element),
      safeprepend(b),
      addModifier(m)
    )(e)
  }
)

const make = memo(function λmake(b) {
  return memo(function λmakeElement(e, m) {
    return (
      m
      ? pipe(
        neue,
        map(m2 => bem(b, e, m2)),
        reduce(concat, []),
        uniq,
        x => x.sort(),
        join(STRINGS.space)
      )(m)
      : bem(b, e)
    )
  })
})

module.exports = {
  bem,
  uniq,
  neue,
  // prepend,
  safeprepend,
  addModifier,
  make
}
