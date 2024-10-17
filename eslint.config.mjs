import fp from "eslint-plugin-fp";
import _import from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends("prettier"),
  {
    plugins: {
      fp,
      import: fixupPluginRules(_import),
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 7,
      sourceType: "module",
    },

    rules: {
      "prettier/prettier": [
        2,
        {
          semi: false,
        },
      ],

      "no-extra-semi": 2,
      "valid-jsdoc": "error",
      "no-var": 2,
      eqeqeq: [2, "smart"],
      "arrow-parens": [2, "as-needed"],
      "consistent-this": 0,
      "func-names": [2],
      "generator-star-spacing": [2, "after"],
      indent: [2, 2],
      "jsx-quotes": [1, "prefer-double"],
      quotes: [2, "backtick"],
      "max-len": [1, 100, 2],

      "new-cap": [
        2,
        {
          capIsNew: false,
        },
      ],

      "no-trailing-spaces": [
        2,
        {
          skipBlankLines: true,
        },
      ],

      "no-unused-vars": [
        2,
        {
          vars: "all",
          varsIgnorePattern: "^___",
        },
      ],

      "object-curly-spacing": 0,
      "one-var": 0,
      "operator-linebreak": [2, "before"],
      "prefer-reflect": 0,
      "space-before-function-paren": [2, "never"],
      strict: 0,

      "no-shadow": [
        2,
        {
          builtinGlobals: false,
          hoist: "all",
        },
      ],

      "import/named": 2,
      "import/no-mutable-exports": 2,
      "import/order": 2,

      "import/extensions": [
        2,
        {
          json: "always",
          js: "never",
          validation: "always",
          task: "always",
        },
      ],
    },
  },
];
