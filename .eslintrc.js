module.exports = {
    extends: [
        'eslint-config-google',
    ],

    parserOptions: {
        ecmaVersion: 6
    },

    env: {
        "browser": false,
        "node": true
    },

    rules: {
        'camelcase': 0,
        'indent': [2, 4],
        'arrow-parens': 0,

        'max-len': 0,
        'no-trailing-spaces': 0,
        'one-var': 0,
        'no-multi-str': 0,
        'no-return-assign': 0,
        'no-negated-condition': 0,

        'no-warning-comments': 2,
        'no-console': 0,
        'no-unused-vars': 2,
        'no-undef': 2,
        'no-use-before-define': 0,
        'semi': 2,
        'no-implicit-coercion': 0,
        'block-scoped-var': 0,
        'eqeqeq': 2,
        'max-nested-callbacks': [2, 6],

        'new-cap': [2, {
            'capIsNewExceptions': ['Snap']
        }],
        'max-statements-per-line': 2,
        'quote-props': 2,
        'no-unreachable': 2,
        'no-nested-ternary': 2,
        'guard-for-in': 2,
        'operator-assignment': 0,

        'comma-dangle': 0,
        'handle-callback-err': 2,
        'valid-jsdoc': 2,

        'no-useless-escape': 0,
        'padded-blocks': 0,
        'no-multiple-empty-lines': 0,
        'comma-spacing': 0,
        'object-curly-spacing': 0,
        'no-multi-spaces': 0,
        'keyword-spacing': 0,
        'key-spacing': 0,
        'semi-spacing': 0,
        'space-before-function-paren': [2, 'never'],
        'space-before-blocks': 0,
        // other
        'no-else-return': 0,
        'require-jsdoc': 0,
        'no-extra-semi': 2,
        'brace-style': 0,
        'no-loop-func': 0,
        'default-case': 0,
    },

    globals: {
        'Promise': true,
    },
};