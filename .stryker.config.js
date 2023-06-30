/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @type {import("@stryker-mutator/api/core").PartialStrykerOptions}
 */
export default {
    disableTypeChecks: false,
    incremental: true,
    incrementalFile: ".stryker/incremental.json",
    ignoreStatic: true,
    mochaOptions: { config: "test/mocharc.json" },
    reporters: ["dots", "clear-text"],
    tempDirName: ".stryker/tmp/",
    testRunner: "mocha",
};
