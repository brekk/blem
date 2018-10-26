module.exports = {
  scripts: {
    build: `rollup -c rollup.config.js`,
    test: `jest --verbose`,
    lint: `eslint src/*.js --env jest --fix`,
    care: `nps build test lint`
  }
}
