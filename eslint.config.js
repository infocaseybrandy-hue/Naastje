const nextConfig = require('eslint-config-next');

const eslintConfig = [
  {
    ignores: ['node_modules/**', '.next/**'],
  },
  ...nextConfig,
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

module.exports = eslintConfig;