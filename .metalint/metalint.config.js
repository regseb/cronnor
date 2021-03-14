export default {
    patterns: [
        "!/.git/",
        "!/coverage/",
        "!/dist/",
        "!/jsdocs/",
        "!/node_modules/",
        "!/types/",
        "**",
    ],
    checkers: [
        {
            patterns: "/src/**/*.js",
            linters: {
                eslint: ["eslint.config.js", "eslint_node.config.js"],
            },
        }, {
            patterns: "/test/**/*.js",
            linters: {
                eslint: [
                    "eslint.config.js",
                    "eslint_node.config.js",
                    "eslint_test.config.js",
                ],
            },
        }, {
            patterns: "/.script/**/*.js",
            linters: {
                eslint: ["eslint.config.js", "eslint_node.config.js"],
            },
        }, {
            patterns: "/.metalint/**/*.js",
            linters: {
                eslint: ["eslint.config.js", "eslint_config.config.js"],
            },
        }, {
            patterns: ["!/CHANGELOG.md", "*.md"],
            linters: "markdownlint",
        }, {
            patterns: "*.json",
            linters: { "jsonlint-mod": null },
        }, {
            patterns: "*.yml",
            linters: { "yaml-lint": null },
        }, {
            patterns: "/package.json",
            linters: "david",
        },
    ],
};
