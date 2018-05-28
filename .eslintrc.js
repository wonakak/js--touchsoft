module.exports = {
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-var': 'off',
    'no-useless-concat': 'off',
    'prefer-destructuring': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-template': 'off',
    'no-param-reassign': ['error', { props: false }]
  },
  env: {
    browser: true
  }
};
