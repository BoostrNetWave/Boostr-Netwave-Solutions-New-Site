module.exports = {
  env: {
    node: true,
    es2021: true,
    commonjs: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    // Errors
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "no-process-exit": "off", // We use process.exit intentionally in graceful shutdown

    // Style
    "prefer-const": "error",
    "eqeqeq": ["error", "always"],
    "no-var": "error",
    "curly": ["error", "all"],
    "semi": ["error", "always"],
    "quotes": ["error", "double", { avoidEscape: true }],
  },
};
