module.exports = {
  root: true,
  extends: ["standard", "prettier", "prettier/standard"],
  plugins: ["prettier", "standard", "mocha"],
  parserOptions: {
    sourceType: "module",
  },
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  rules: {
    // @todo Remove after beta, useful for dev purposes.
    "no-unused-vars": "off",
    camelcase: "error",
    "comma-dangle": ["error", "only-multiline"],
  },
  globals: {
    describe: true,
    expect: true,
    it: true,
    beforeEach: true,
    afterEach: true,
  },
};
