/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import Cron, * as cronnor from "../src/index.js";

describe("index.js", function () {
    describe("Cron", function () {
        it("should export Cron as default", function () {
            assert.equal(Cron.name, "Cron");
        });
    });

    describe("cronnor", function () {
        it("should export Cron", function () {
            assert.equal(cronnor.Cron.name, "Cron");
        });

        it("should export CronExp", function () {
            assert.equal(cronnor.CronExp.name, "CronExp");
        });

        it("should export At", function () {
            assert.equal(cronnor.At.name, "At");
        });
    });
});
