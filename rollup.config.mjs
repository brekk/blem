//import { nodeResolve } from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import ts from "@rollup/plugin-typescript";
import pkg from "./package.json" with { type: "json" };

const plugins = [
  json(),
  cjs({ extensions: [`.js`], include: `node_modules/**` }),
  babel(),
  //nodeResolve({ mainFields: ["browser", "jsnext:main", "module", "main"] }),
  ts(),
];
const external = Object.keys(pkg.dependencies) || [];

export default [
  {
    input: `src/index.js`,
    output: {
      name: pkg.name,
      file: pkg.browser,
      format: `umd`,
    },
    plugins,
  },
  {
    input: `src/index.js`,
    external,
    output: [
      { file: pkg.main, format: `cjs`, exports: "default" },
      { file: pkg.module, format: `es` },
    ],
    plugins,
  },
];
