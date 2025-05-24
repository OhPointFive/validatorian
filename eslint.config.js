// @ts-check

const eslint = require("@eslint/js");
const typescriptESLint = require("typescript-eslint");
const stylistic = require("@stylistic/eslint-plugin");

module.exports = typescriptESLint.config(
    {
        ignores: ["node_modules", "coverage", "dist", "eslint.config.js", "vitest.config.ts"],
    },
    eslint.configs.recommended,
    stylistic.configs["recommended"],
    ...typescriptESLint.configs.strictTypeChecked,
    ...typescriptESLint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            // These are useful in tests to ensure something throws,
            // and it's usually self-evident why they are being invoked.
            "@typescript-eslint/ban-ts-comment": "off",

            "@typescript-eslint/restrict-template-expressions": [
                "error",
                {
                    allowNumber: true,
                    allowBoolean: true,
                    allowNullish: true,
                },
            ],

            "@stylistic/indent": [
                "error",
                4,
                {
                    SwitchCase: 1,
                },
            ],
            "@stylistic/indent-binary-ops": ["error", 4],
            "@stylistic/semi": ["error", "always"],
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/arrow-parens": ["error", "as-needed"],
            "@stylistic/brace-style": [
                "error",
                "1tbs",
                {
                    allowSingleLine: true,
                },
            ],
            "@stylistic/max-statements-per-line": "off",
            "@stylistic/member-delimiter-style": [
                "error",
                {
                    multiline: {
                        delimiter: "semi",
                        requireLast: true,
                    },
                    singleline: {
                        delimiter: "comma",
                        requireLast: false,
                    },
                },
            ],
        },
    },
    {
        files: ["test/**/*.test.ts"],
        rules: {
            // Tests often have unused variables to make sure type checking passes.
            "@typescript-eslint/no-unused-vars": "off",
            // Tests use empty arrow functions a value to be validated.
            "@typescript-eslint/no-empty-function": "off",
        },
    }
);
