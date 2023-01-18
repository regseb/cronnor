export default {
    incremental: true,
    incrementalFile: ".stryker/stryker-incremental.json",
    ignoreStatic: true,
    reporters: ["dots", "clear-text"],
    tempDirName: ".stryker/tmp/",
    testRunner: "mocha",
};
