js = require('@eslint/js')

module.exports = [
  js.configs.recommended,

  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn'
    },
    languageOptions: {
      globals: {
        browser: true,
        node: true
      }
    }
  }
]
