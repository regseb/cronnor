import assert       from "assert";
import * as cronnor from "../src/index.js";

describe("index.js", function () {
    describe("cronnor", function () {
        it("should export Cron", function () {
            assert.ok("Cron" in cronnor);
        });

        it("should export CronExp", function () {
            assert.ok("CronExp" in cronnor);
        });
    });
});
