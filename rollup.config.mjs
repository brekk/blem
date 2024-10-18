import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import cjs from "@rollup/plugin-commonjs"
import babel from "@rollup/plugin-babel"
import json from "@rollup/plugin-json"
import pkg from "./package.json" with { type: "json" }

const plugins = [
  //json(),
  // cjs({ extensions: [`.js`], include: `node_modules/**` }),
  //babel({ babelHelpers: "runtime" }),
  //nodeResolve({ mainFields: ["browser", "jsnext:main", "module", "main"] }),
]
const external = Object.keys(pkg.dependencies) || []

export default [
  {
    input: `src/index.js`,
    output: {
      name: pkg.name,
      file: pkg.browser,
      format: `umd`,
      //globals: {
      //  ramda: "ramda",
      //  "fast-memoize": "memo",
      //},
    },
    plugins: [
      cjs({ extensions: [`.js`], include: `node_modules/**` }),
      nodeResolve(),
      terser({
        compress: {
          passes: 2,
        },
      }),
    ],
  },
  {
    input: `src/index.js`,
    external,
    output: [
      { file: pkg.main, format: `cjs`, exports: "default" },
      { file: pkg.module, format: `es` },
    ],
    plugins: [
      nodeResolve(),
      babel({ babelHelpers: "bundled", exclude: "node_modules/**" }),
    ],
  },
]
