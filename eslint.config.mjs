import { defineConfig } from "eslint/config";

export default defineConfig({
  root: true,
  extends: ["next/core-web-vitals"],
  ignorePatterns: [
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts"
  ],
  rules: {
    // قواعد إضافية حسب احتياجك
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error"
  }
});
