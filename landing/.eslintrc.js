const errorOnProduction =
  process.env.NODE_ENV === "production" ? "error" : "off";

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-unused-vars": errorOnProduction,
    "no-debugger": errorOnProduction,
    "comma-dangle": ["error", "only-multiline"],
  },
};
