import { uniq, neue, prepend, safeprepend, addModifier, bem } from "./blem"
test(`uniq`, () => {
  expect(uniq(`baffled`.split(``))).toEqual(`bafled`.split(``))
})
test(`neue`, () => {
  const input = `abc`.split(``)
  const output = neue(input)
  input.push(`x`)
  expect(input).toEqual(`abcx`.split(``))
  expect(output).toEqual(`abc`.split(``))
})
test(`prepend`, () => {
  expect(prepend(`xxx`, `yyy`)).toEqual(`xxxyyy`)
})
test(`safeprepend`, () => {
  expect(safeprepend(`>`, `<`)).toEqual(`><`)
  expect(safeprepend(`___`, false)).toEqual(``)
})
test(`addModifier`, () => {
  expect(addModifier(`)))`, `x`)).toEqual([`x`, `x--)))`])
  expect(addModifier(false, `x`)).toEqual(`x`)
})
test(`bem`, () => {
  expect(bem(`b`, `e`, `m`)).toEqual([`b__e`, `b__e--m`])
  expect(bem(`b`, `e`)).toEqual(`b__e`)
})
