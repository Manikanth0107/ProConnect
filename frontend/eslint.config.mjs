import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    languageOptions: {
      parser: "espree", // ✅ Explicit JS parser for FlatConfig with Vercel compatibility
    },
  },
  ...compat.extends("next/core-web-vitals"),
];
