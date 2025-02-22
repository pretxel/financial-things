import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigNext from "@next/eslint-plugin-next";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/**.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
    },
  },
  {
    ...eslintConfigNext.configs.recommended,
    plugins: {
      "@next/next": eslintConfigNext,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "import/no-unresolved": "off",
    },
  },
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default eslintConfig;
