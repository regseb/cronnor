/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @type {import("@stryker-mutator/api/core").PartialStrykerOptions}
 */
export default {
    incremental: true,
    incrementalFile: ".stryker/incremental.json",
    ignoreStatic: true,
    reporters: ["dots", "clear-text"],
    tempDirName: ".stryker/tmp/",
    testRunner: "mocha",
};
