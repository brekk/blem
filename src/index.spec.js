import { test, expect } from "vitest"
import blem from "./index"

test("blem", () => {
  const x = blem("block")
  expect(x("element")).toEqual("block__element")
  expect(x("element", ["modifier"])).toEqual(
    "block__element block__element--modifier",
  )
  expect(x("element", "abc".split(""))).toEqual(
    "block__element block__element--a block__element--b block__element--c",
  )
  expect(x("element", "cabbage".split(""))).toEqual(
    [
      "block__element block__element--a block__element--b",
      "block__element--c block__element--e block__element--g",
    ].join(" "),
  )
  expect(blem("x")("", "z")).toEqual("x x--z")
  expect(blem("x")("", "zap".split(""))).toEqual("x x--a x--p x--z")
  expect(blem("x")("y", "")).toEqual("x__y")
  expect(blem("x")("y", "z")).toEqual("x__y x__y--z")
})
test("blem with non-string inputs", () => {
  const x = blem(false)
  expect(x()).toEqual("")
  const y = blem("block")
  expect(y(false)).toEqual("block")
  expect(y(false, () => false)).toEqual("block")
  expect(y(false, [() => "a", () => "b"])).toEqual("block")
  expect(y("", false)).toEqual("block")
  expect(y("", () => false)).toEqual("block")
  expect(y("", [() => false, false])).toEqual("block")
})
