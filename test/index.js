import assert from "node:assert";
// eslint-disable-next-line import/no-named-as-default
import Cron, * as cronnor from "../src/index.js";

describe("index.js", function () {
    describe("Cron", function () {
        it("should export Cron as default", function () {
            assert.strictEqual(Cron.name, "Cron");
        });
    });

    describe("cronnor", function () {
        it("should export Cron", function () {
            assert.ok("Cron" in cronnor);
        });

        it("should export CronExp", function () {
            assert.ok("CronExp" in cronnor);
        });
    });
});
