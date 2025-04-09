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
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    args: "none",
                    caughtErrors: "none",
                },
            ],
            "@typescript-eslint/restrict-template-expressions": "off",

            // I know what I"m doing
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-function": "off",

            // These unsafe rules seem to be giving VSCode trouble
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-return": "off",

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
);
