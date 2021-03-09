export default {
    plugins: [
        "filenames", "import", "jsdoc", "mocha", "node", "promise", "unicorn",
    ],

    parserOptions: {
        sourceType: "module",
    },

    env: {
        es2021: true,
    },

    rules: {
        "for-direction": 2,
        "getter-return": 2,
        "no-async-promise-executor": 2,
        "no-await-in-loop": 0,
        "no-compare-neg-zero": 2,
        "no-cond-assign": 2,
        "no-console": 2,
        "no-constant-condition": 2,
        "no-control-regex": 2,
        "no-debugger": 2,
        "no-dupe-args": 2,
        "no-dupe-else-if": 2,
        "no-dupe-keys": 2,
        "no-duplicate-case": 2,
        "no-empty-character-class": 2,
        "no-empty": 2,
        "no-ex-assign": 2,
        "no-extra-boolean-cast": 2,
        "no-extra-parens": [2, "all", { enforceForArrowConditionals: false }],
        "no-extra-semi": 2,
        "no-func-assign": 2,
        "no-import-assign": 2,
        "no-inner-declarations": [2, "both"],
        "no-invalid-regexp": 2,
        "no-irregular-whitespace": [2, {
            skipStrings: false,
            skipComments: false,
            skipRegExps: false,
            skipTemplates: false,
        }],
        "no-loss-of-precision": 2,
        "no-misleading-character-class": 2,
        "no-obj-calls": 2,
        "no-promise-executor-return": 2,
        "no-prototype-builtins": 2,
        "no-regex-spaces": 2,
        "no-setter-return": 2,
        "no-sparse-arrays": 2,
        "no-template-curly-in-string": 2,
        "no-unexpected-multiline": 2,
        "no-unreachable": 2,
        "no-unreachable-loop": 2,
        "no-unsafe-finally": 2,
        "no-unsafe-negation": [2, { enforceForOrderingRelations: true }],
        "no-unsafe-optional-chaining": [2, {
            disallowArithmeticOperators: true,
        }],
        "no-useless-backreference": 2,
        "require-atomic-updates": 0,
        "use-isnan": [2, {
            enforceForSwitchCase: true,
            enforceForIndexOf: true,
        }],
        "valid-typeof": 2,

        "accessor-pairs": [2, { enforceForClassMembers: true }],
        "array-callback-return": 2,
        "block-scoped-var": 2,
        "class-methods-use-this": 2,
        complexity: [1, { max: 50 }],
        "consistent-return": 2,
        curly: 2,
        "default-case": 2,
        "default-param-last": 2,
        "dot-location": [2, "property"],
        "dot-notation": [2, { allowKeywords: true, allowPattern: "_" }],
        eqeqeq: 2,
        "grouped-accessor-pairs": [2, "getBeforeSet"],
        "guard-for-in": 2,
        "max-classes-per-file": 2,
        "no-alert": 2,
        "no-caller": 2,
        "no-case-declarations": 2,
        "no-constructor-return": 2,
        "no-div-regex": 2,
        "no-else-return": [2, { allowElseIf: false }],
        "no-empty-function": [2, { allow: ["arrowFunctions"] }],
        "no-empty-pattern": 2,
        "no-eq-null": 2,
        "no-eval": 2,
        "no-extend-native": 2,
        "no-extra-bind": 2,
        "no-extra-label": 2,
        "no-fallthrough": 2,
        "no-floating-decimal": 2,
        "no-global-assign": 2,
        "no-implicit-coercion": 2,
        "no-implicit-globals": 2,
        "no-implied-eval": 2,
        "no-invalid-this": 2,
        "no-iterator": 2,
        "no-labels": 2,
        "no-lone-blocks": 2,
        "no-loop-func": 1,
        "no-magic-numbers": 0,
        "no-multi-spaces": 0,
        "no-multi-str": 2,
        "no-new-func": 2,
        "no-new-wrappers": 2,
        "no-nonoctal-decimal-escape": 2,
        "no-new": 2,
        "no-octal-escape": 2,
        "no-octal": 2,
        "no-param-reassign": [2, {
            props: true,
            ignorePropertyModificationsFor: ["input"],
        }],
        "no-proto": 2,
        "no-redeclare": 2,
        "no-restricted-properties": 2,
        "no-return-assign": 2,
        "no-return-await": 2,
        "no-script-url": 2,
        "no-self-assign": 2,
        "no-self-compare": 2,
        "no-sequences": 2,
        "no-throw-literal": 2,
        "no-unmodified-loop-condition": 2,
        "no-unused-expressions": 2,
        "no-unused-labels": 2,
        "no-useless-call": 2,
        "no-useless-catch": 2,
        "no-useless-concat": 2,
        "no-useless-escape": 2,
        "no-useless-return": 2,
        "no-void": 2,
        "no-warning-comments": 1,
        "no-with": 2,
        "prefer-named-capture-group": 0,
        "prefer-promise-reject-errors": 2,
        "prefer-regex-literals": 2,
        radix: 2,
        "require-await": 2,
        "require-unicode-regexp": 2,
        "vars-on-top": 0,
        "wrap-iife": 2,
        yoda: [2, "always"],

        strict: [2, "never"],

        "init-declarations": 0,
        "no-delete-var": 2,
        "no-label-var": 2,
        "no-restricted-globals": 2,
        "no-shadow-restricted-names": 2,
        "no-shadow": 2,
        "no-undef": 2,
        "no-undefined": 0,
        "no-unused-vars": [2, {
            args: "all",
            argsIgnorePattern: "^_",
            caughtErrors: "all",
            caughtErrorsIgnorePattern: "^_",
        }],
        "no-use-before-define": 2,

        "array-bracket-newline": [2, "consistent"],
        "array-bracket-spacing": 2,
        "array-element-newline": [2, "consistent"],
        "block-spacing": 2,
        "brace-style": 2,
        camelcase: 2,
        "capitalized-comments": [2, "always", {
            ignoreConsecutiveComments: true,
        }],
        "comma-dangle": [2, "always-multiline"],
        "comma-spacing": 2,
        "comma-style": 2,
        "computed-property-spacing": [2, "never", {
            enforceForClassMembers: true,
        }],
        "consistent-this": 2,
        "eol-last": 2,
        "func-call-spacing": [2, "never"],
        "func-name-matching": [2, { considerPropertyDescriptor: true }],
        "func-names": [2, "as-needed"],
        "func-style": 2,
        "function-call-argument-newline": [2, "consistent"],
        "function-paren-newline": [2, "consistent"],
        "id-denylist": 0,
        "id-length": 0,
        "id-match": 0,
        "implicit-arrow-linebreak": 2,
        indent: 0,
        "jsx-quotes": 0,
        "key-spacing": [2, { mode: "minimum", align: "value" }],
        "keyword-spacing": 2,
        "line-comment-position": 2,
        "linebreak-style": 2,
        "lines-around-comment": 2,
        "lines-between-class-members": 2,
        "max-depth": [1, { max: 5 }],
        "max-len": 1,
        "max-lines": [1, {
            max: 1000, skipBlankLines: true, skipComments: true,
        }],
        "max-lines-per-function": [1, {
            max: 100, skipBlankLines: true, skipComments: true,
        }],
        "max-nested-callbacks": 1,
        "max-params": [1, { max: 5 }],
        "max-statements": [1, { max: 50 }],
        "max-statements-per-line": [2, { max: 2 }],
        "multiline-comment-style": [2, "separate-lines"],
        "multiline-ternary": 0,
        "new-cap": 2,
        "new-parens": 2,
        "newline-per-chained-call": 0,
        "no-array-constructor": 2,
        "no-bitwise": 0,
        "no-continue": 0,
        "no-inline-comments": 2,
        "no-lonely-if": 2,
        "no-mixed-operators": 0,
        "no-mixed-spaces-and-tabs": 2,
        "no-multi-assign": 2,
        "no-multiple-empty-lines": [2, { max: 2, maxEOF: 0, maxBOF: 0 }],
        "no-negated-condition": 2,
        "no-nested-ternary": 0,
        "no-new-object": 2,
        "no-plusplus": 0,
        "no-restricted-syntax": [
            2,
            "ClassDeclaration",
            "DebuggerStatement",
            "EmptyStatement",
            "ForInStatement",
            "FunctionDeclaration",
            "LabeledStatement",
            "SequenceExpression",
            "TaggedTemplateExpression",
            "WithStatement",
            "YieldExpression",
            "JSXIdentifier",
            "JSXNamespacedName",
            "JSXMemberExpression",
            "JSXEmptyExpression",
            "JSXExpressionContainer",
            "JSXElement",
            "JSXClosingElement",
            "JSXOpeningElement",
            "JSXAttribute",
            "JSXSpreadAttribute",
            "JSXText",
            "ExportDefaultDeclaration",
            "ExportAllDeclaration",
            "ExportSpecifier",
        ],
        "no-tabs": 2,
        "no-ternary": 0,
        "no-trailing-spaces": 2,
        "no-underscore-dangle": 0,
        "no-unneeded-ternary": 2,
        "no-whitespace-before-property": 2,
        "nonblock-statement-body-position": 2,
        "object-curly-newline": 2,
        "object-curly-spacing": [2, "always"],
        "object-property-newline": [2, {
            allowAllPropertiesOnSameLine: true,
        }],
        "one-var-declaration-per-line": 2,
        "one-var": [2, "never"],
        "operator-assignment": 2,
        "operator-linebreak": 2,
        "padded-blocks": [2, { switches: "never" }],
        "padding-line-between-statements": [2, {
            blankLine: "always", prev: "directive", next: "*",
        }],
        "prefer-exponentiation-operator": 2,
        "prefer-object-spread": 2,
        "quote-props": [2, "as-needed"],
        quotes: [2, "double", { allowTemplateLiterals: true }],
        semi: 2,
        "semi-spacing": 2,
        "semi-style": [2, "last"],
        "sort-keys": 0,
        "sort-vars": 0,
        "space-before-blocks": 2,
        "space-before-function-paren": [2, {
            anonymous: "always",
            named: "never",
        }],
        "space-in-parens": 2,
        "space-infix-ops": 2,
        "space-unary-ops": 2,
        "spaced-comment": 2,
        "switch-colon-spacing": 2,
        "template-tag-spacing": 2,
        "unicode-bom": 2,
        "wrap-regex": 2,

        "arrow-body-style": 0,
        "arrow-parens": 2,
        "arrow-spacing": 2,
        "constructor-super": 2,
        "generator-star-spacing": 2,
        "no-class-assign": 2,
        "no-confusing-arrow": 2,
        "no-const-assign": 2,
        "no-dupe-class-members": 2,
        "no-duplicate-imports": 2,
        "no-new-symbol": 2,
        "no-restricted-imports": 2,
        "no-this-before-super": 2,
        "no-useless-computed-key": 2,
        "no-useless-constructor": 2,
        "no-useless-rename": 2,
        "no-var": 2,
        "object-shorthand": 2,
        "prefer-arrow-callback": 2,
        "prefer-const": 2,
        "prefer-destructuring": 0,
        "prefer-numeric-literals": 2,
        "prefer-rest-params": 2,
        "prefer-spread": 2,
        "prefer-template": 0,
        "require-yield": 2,
        "rest-spread-spacing": 2,
        "sort-imports": [2, {
            ignoreDeclarationSort: true,
            allowSeparatedGroups: true,
        }],
        "symbol-description": 2,
        "template-curly-spacing": 2,
        "yield-star-spacing": 2,

        "filenames/match-regex": [2, "^_?[a-z][0-9a-z]*(-[0-9a-z]+)*$"],
        "filenames/match-exported": [2, "kebab"],
        "filenames/no-index": 0,

        "import/no-unresolved": 2,
        "import/named": 2,
        "import/default": 2,
        "import/namespace": 2,
        "import/no-restricted-paths": 2,
        "import/no-absolute-path": 2,
        "import/no-dynamic-require": 2,
        "import/no-internal-modules": 0,
        "import/no-webpack-loader-syntax": 2,
        "import/no-self-import": 2,
        "import/no-cycle": 2,
        "import/no-useless-path-segments": 2,
        "import/no-relative-parent-imports": 0,
        "import/no-unused-modules": 2,

        "import/export": 2,
        "import/no-named-as-default": 2,
        "import/no-named-as-default-member": 2,
        "import/no-deprecated": 2,
        "import/no-extraneous-dependencies": 2,
        "import/no-mutable-exports": 2,

        "import/unambiguous": 0,
        "import/no-commonjs": 2,
        "import/no-amd": 2,
        "import/no-nodejs-modules": 2,

        "import/first": 2,
        "import/exports-last": 0,
        "import/no-duplicates": 2,
        "import/no-namespace": 2,
        "import/extensions": [2, "ignorePackages"],
        "import/order": 2,
        "import/newline-after-import": 2,
        "import/prefer-default-export": 0,
        "import/max-dependencies": 0,
        "import/no-unassigned-import": 2,
        "import/no-named-default": 2,
        "import/no-default-export": 2,
        "import/no-named-export": 0,
        "import/no-anonymous-default-export": 2,
        "import/group-exports": 0,
        "import/dynamic-import-chunkname": 0,

        "jsdoc/check-access": 2,
        "jsdoc/check-alignment": 2,
        "jsdoc/check-examples": 2,
        "jsdoc/check-indentation": 0,
        "jsdoc/check-param-names": 2,
        "jsdoc/check-property-names": 2,
        "jsdoc/check-syntax": 2,
        "jsdoc/check-tag-names": 2,
        "jsdoc/check-types": 2,
        "jsdoc/check-values": 2,
        "jsdoc/empty-tags": 2,
        "jsdoc/implements-on-classes": 2,
        "jsdoc/match-description": [2, { matchDescription: "[A-ZÉ].*" }],
        "jsdoc/newline-after-description": 2,
        "jsdoc/no-types": 0,
        "jsdoc/no-undefined-types": [2, { definedTypes: ["Timeout"] }],
        "jsdoc/require-description": 2,
        "jsdoc/require-description-complete-sentence": 0,
        "jsdoc/require-example": 0,
        "jsdoc/require-file-overview": 0,
        "jsdoc/require-hyphen-before-param-description": [2, "never"],
        "jsdoc/require-jsdoc": 2,
        "jsdoc/require-param": 2,
        "jsdoc/require-param-description": 2,
        "jsdoc/require-param-name": 2,
        "jsdoc/require-param-type": 2,
        "jsdoc/require-property": 2,
        "jsdoc/require-property-description": 2,
        "jsdoc/require-property-name": 2,
        "jsdoc/require-property-type": 2,
        "jsdoc/require-returns": 0,
        "jsdoc/require-returns-check": 2,
        "jsdoc/require-returns-description": 2,
        "jsdoc/require-returns-type": 2,
        "jsdoc/valid-types": 2,

        "promise/catch-or-return": 0,
        "promise/no-return-wrap": 2,
        "promise/param-names": 2,
        "promise/always-return": 0,
        "promise/no-native": 0,
        "promise/no-nesting": 2,
        "promise/no-promise-in-callback": 2,
        "promise/no-callback-in-promise": 2,
        "promise/avoid-new": 0,
        "promise/no-new-statics": 2,
        "promise/no-return-in-finally": 2,
        "promise/valid-params": 2,
        "promise/prefer-await-to-then": 0,
        "promise/prefer-await-to-callbacks": 0,

        "unicorn/better-regex": 2,
        "unicorn/catch-error-name": [2, {
            name: "err",
            caughtErrorsIgnorePattern: "^$",
        }],
        "unicorn/consistent-destructuring": 2,
        "unicorn/consistent-function-scoping": 2,
        "unicorn/custom-error-definition": 2,
        "unicorn/empty-brace-spaces": 2,
        "unicorn/error-message": 2,
        "unicorn/escape-case": 2,
        "unicorn/expiring-todo-comments": 0,
        "unicorn/explicit-length-check": 0,
        "unicorn/filename-case": [2, { case: "kebabCase" }],
        "unicorn/import-index": 0,
        "unicorn/import-style": 2,
        "unicorn/new-for-builtins": 2,
        "unicorn/no-abusive-eslint-disable": 2,
        "unicorn/no-array-callback-reference": 0,
        "unicorn/no-array-for-each": 0,
        "unicorn/no-array-push-push": 2,
        "unicorn/no-array-reduce": 0,
        "unicorn/no-console-spaces": 2,
        "unicorn/no-for-loop": 2,
        "unicorn/no-hex-escape": 2,
        "unicorn/no-instanceof-array": 2,
        "unicorn/no-keyword-prefix": 2,
        "unicorn/no-lonely-if": 2,
        "unicorn/no-nested-ternary": 0,
        "unicorn/no-new-array": 2,
        "unicorn/no-new-buffer": 2,
        "unicorn/no-null": 0,
        "unicorn/no-object-as-default-parameter": 2,
        "unicorn/no-process-exit": 2,
        "unicorn/no-this-assignment": 2,
        "unicorn/no-unreadable-array-destructuring": 2,
        "unicorn/no-unsafe-regex": 2,
        "unicorn/no-unused-properties": 2,
        "unicorn/no-useless-undefined": 0,
        "unicorn/no-zero-fractions": 2,
        "unicorn/number-literal-case": 2,
        "unicorn/numeric-separators-style": 2,
        "unicorn/prefer-add-event-listener": 2,
        "unicorn/prefer-array-find": 2,
        "unicorn/prefer-array-flat-map": 2,
        "unicorn/prefer-array-index-of": 2,
        "unicorn/prefer-array-some": 2,
        "unicorn/prefer-date-now": 2,
        "unicorn/prefer-default-parameters": 2,
        "unicorn/prefer-dom-node-append": 2,
        "unicorn/prefer-dom-node-dataset": 2,
        "unicorn/prefer-dom-node-remove": 2,
        "unicorn/prefer-dom-node-text-content": 2,
        "unicorn/prefer-includes": 2,
        "unicorn/prefer-keyboard-event-key": 2,
        "unicorn/prefer-math-trunc": 2,
        "unicorn/prefer-modern-dom-apis": 2,
        "unicorn/prefer-negative-index": 2,
        "unicorn/prefer-number-properties": 2,
        "unicorn/prefer-optional-catch-binding": 2,
        "unicorn/prefer-query-selector": 2,
        "unicorn/prefer-reflect-apply": 2,
        "unicorn/prefer-regexp-test": 2,
        "unicorn/prefer-set-has": 2,
        "unicorn/prefer-spread": 0,
        "unicorn/prefer-string-replace-all": 2,
        "unicorn/prefer-string-slice": 2,
        "unicorn/prefer-string-starts-ends-with": 2,
        "unicorn/prefer-string-trim-start-end": 2,
        "unicorn/prefer-ternary": 2,
        "unicorn/prefer-type-error": 2,
        "unicorn/prevent-abbreviations": 0,
        "unicorn/sring-content": 0,
        "unicorn/throw-new-error": 2,
    },

    settings: {
        jsdoc: {
            mode: "typescript",
            preferredTypes: {
                ".<>": "<>",
                "Array<>": "[]",
                object: "Object",
            },
            tagNamePreference: {
                virtual: "abstract",
                extends: "augments",
                constructor: "class",
                const: "constant",
                defaultvalue: "default",
                desc: "description",
                host: "external",
                fileoverview: "file",
                overview: "file",
                emits: "fires",
                func: "function",
                method: "function",
                var: "member",
                arg: "param",
                argument: "param",
                prop: "property",
                return: "returns",
                exception: "throws",
                yield: "yields",
                linkcode: "link",
                linkplain:" link",
            },
        },
    },
};
