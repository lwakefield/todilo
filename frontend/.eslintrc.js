module.exports = {
  root: true,
  // https://github.com/feross/standard/blob/master/RULES.md\#javascript-standard-style
  extends: 'standard',
  plugins: [
    'html'
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "modules": true,
      "jsx": true
    }
  },
  globals: {
    'atob': true,
    localStorage: true,
    API_ENDPOINT: true
  },
  // add your custom rules here
  'rules': {
    "no-unused-vars": [0, { "varsIgnorePattern": "^h$" }],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-throw-literal':0
  }
}
