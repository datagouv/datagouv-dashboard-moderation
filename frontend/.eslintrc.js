NO_LINTING_MODES = [
  'production',
  'dev_no_linting'
]
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': NO_LINTING_MODES.includes(process.env.NODE_ENV)? 'off' : 'warn',
    'no-debugger': NO_LINTING_MODES.includes(process.env.NODE_ENV) ? 'off' : 'warn'
  }
}
