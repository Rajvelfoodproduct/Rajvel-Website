import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".next-dev/**",
      "out/**",
      "dist/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off",
    },
  },
];

export default eslintConfig;
