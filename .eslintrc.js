module.exports = {
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-var': 'off',
    'no-useless-concat': 'off',
    'prefer-destructuring': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-template': 'off',
    'no-param-reassign': ['error', { props: false }],
    'object-shorthand': 'off',
    'no-plusplus': 'off',
    'prefer-rest-params': 'off',
    'import/no-unresolved': 'off',
    'func-names': ['error', 'as-needed']
  },
  env: {
    browser: true,
    node: false
  },
  parserOptions: {
    sourceType: 'script',
    ecmaFeatures: { impliedStrict: true }
  }
};
