module.exports = {
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-var': 'off',
    'prefer-destructuring': 'off',
    'prefer-arrow-callback': 'off',
    'no-param-reassign': ['error', { props: false }]
  },
  env: {
    browser: true
  }
};
