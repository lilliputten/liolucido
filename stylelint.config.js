module.exports = {
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-recommended-scss',
    'stylelint-config-tailwindcss',
  ],
  plugins: ['stylelint-order', 'stylelint-scss'],
  rules: {
    'at-rule-no-deprecated': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          // Tailwind rules
          'forward',
          'function',
          'include',
          'mixin',
          'return',
          'tailwind',
          'use',
          // 'apply',
          // 'layer',
          // 'responsive',
          // 'screen',
          // 'variants',
        ],
      },
    ],
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          // Tailwind rules
          'apply',
          'layer',
          'responsive',
          'screen',
          'tailwind',
          'variants',
        ],
      },
    ],
  },
};
