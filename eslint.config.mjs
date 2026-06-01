import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "outputs/**", "PUBLICAR_GITHUB_GESTAO_GPPE/**"]
  },
  ...nextVitals
];

export default eslintConfig;
