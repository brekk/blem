import resolve from "rollup-plugin-node-resolve"
import cjs from "rollup-plugin-commonjs"
import buble from "rollup-plugin-buble"
import babili from "rollup-plugin-babel-minify"
import cleanup from "rollup-plugin-cleanup"
import json from "rollup-plugin-json"
import progress from "rollup-plugin-progress"
import prepack from "rollup-plugin-prepack"
import pkg from "./package.json"
import camelCase from "camel-case"

const plugins = [
  progress(),
  json(),
  cjs({ extensions: [`.js`], include: `node_modules/**` }),
  buble(),
  resolve({ jsnext: true, main: true }),
  cleanup({ comments: `none` })
]
const external = [`f-utility`, `memoizee`]

export default [
  {
    input: `src/blem.js`,
    output: {
      name: camelCase(pkg.name),
      file: pkg.browser,
      format: `umd`
    },
    plugins
  },
  {
    input: `src/index.js`,
    external,
    output: [
      { file: pkg.main, format: `cjs` },
      { file: pkg.module, format: `es` }
    ],
    plugins
  }
]
