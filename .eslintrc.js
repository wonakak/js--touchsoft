module.exports = {
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-var': 'off',
    'prefer-destructuring': 'off',
    'prefer-arrow-callback': 'off',
  },
  env: {
    browser: true,
  },
};
