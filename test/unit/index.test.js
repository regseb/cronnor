/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Cron, * as cronnor from "../../src/index.js";

describe("index.js", () => {
    describe("Cron", () => {
        it("should export Cron as default", () => {
            assert.equal(Cron.name, "Cron");
        });
    });

    describe("cronnor", () => {
        it("should export Cron", () => {
            assert.equal(cronnor.Cron.name, "Cron");
        });

        it("should export CronExp", () => {
            assert.equal(cronnor.CronExp.name, "CronExp");
        });

        it("should export At", () => {
            assert.equal(cronnor.At.name, "At");
        });
    });
});
