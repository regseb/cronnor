export default {
    patterns: [
        "!/.git/",
        "!/.stryker-tmp/",
        "!/index.d.ts",
        "!/index.js",
        "!/jsdocs/",
        "!/node_modules/",
        "!*.swp",
        "**",
    ],
    checkers: [
        {
            patterns: ["/src/**/*.js", "/mod.js"],
            linters: "eslint",
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
        },
    ],
};
