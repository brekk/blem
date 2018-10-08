const blem = require('./index')
test(`blem`, () => {
  const x = blem(`block`)
  expect(x(`element`)).toEqual(
    `block__element`
  )
  expect(x(`element`, [`modifier`])).toEqual(
    `block__element block__element--modifier`
  )
  expect(x(`element`, `abc`.split(``))).toEqual(
    `block__element block__element--a block__element--b block__element--c`
  )
  expect(x(`element`, `cabbage`.split(``))).toEqual(
    `block__element block__element--a block__element--b block__element--c block__element--e block__element--g`
  )
  expect(blem(`x`)(``, ``)).toEqual(``)
  expect(blem(`x`)(`y`, ``)).toEqual(`x__y`)
  expect(blem(`x`)(`y`, `z`)).toEqual(`x__y x__y--z`)
})
