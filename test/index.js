import assert from "node:assert";
import Cron, * as cronnor from "../src/index.js";

describe("index.js", function () {
    describe("Cron", function () {
        it("should export Cron as default", function () {
            assert.strictEqual(Cron.name, "Cron");
        });
    });

    describe("cronnor", function () {
        it("should export Cron", function () {
            assert.strictEqual(cronnor.Cron.name, "Cron");
        });

        it("should export CronExp", function () {
            assert.strictEqual(cronnor.CronExp.name, "CronExp");
        });

        it("should export At", function () {
            assert.strictEqual(cronnor.At.name, "At");
        });
    });
});
