/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import At from "../src/at.js";

describe("at.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("At", function () {
        describe("constructor()", function () {
            it("should use default values", function () {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const at = new At(new Date("2000-01-01T00:01"), func);

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);

                assert.equal(func.mock.callCount(), 1);
                assert.deepEqual(func.mock.calls[0].this, at);
                assert.deepEqual(func.mock.calls[0].arguments, []);
            });

            it("should bind thisArg", function () {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                // eslint-disable-next-line no-new
                new At(new Date("2000-01-01T00:01"), func, { thisArg: "foo" });

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);

                assert.equal(func.mock.callCount(), 1);
                assert.deepEqual(func.mock.calls[0].this, "foo");
                assert.deepEqual(func.mock.calls[0].arguments, []);
            });

            it("should bind args", function () {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const at = new At(new Date("2000-01-01T00:01"), func, {
                    args: ["foo", "bar", 42],
                });

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);

                assert.equal(func.mock.callCount(), 1);
                assert.deepEqual(func.mock.calls[0].this, at);
                assert.deepEqual(func.mock.calls[0].arguments, [
                    "foo",
                    "bar",
                    42,
                ]);
            });

            it("should set one interval", function () {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                // eslint-disable-next-line no-new
                new At(new Date("2000-01-01T00:01"), func);

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);
                assert.equal(func.mock.callCount(), 1);
                mock.timers.tick(1);
                assert.equal(func.mock.callCount(), 1);
            });

            it("should set exactly one interval", function () {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                // eslint-disable-next-line no-new
                new At(new Date("2000-01-25T20:31:23.647"), func);

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(2_147_483_647);
                assert.equal(func.mock.callCount(), 1);
            });

            it("should add intermediate steps", function () {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                // eslint-disable-next-line no-new
                new At(new Date("2000-01-25T20:31:23.648"), func);

                // Incrémenter deux fois le temps pour les setTimeout().
                // https://github.com/nodejs/node/issues/55367
                mock.timers.tick(2_147_483_647);
                assert.equal(func.mock.callCount(), 0);
                mock.timers.tick(1);
                assert.equal(func.mock.callCount(), 1);
            });

            it("should add many intermediate steps", function () {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                // eslint-disable-next-line no-new
                new At(new Date("2000-02-19T17:02:47.295"), func);

                // Incrémenter trois fois le temps pour les setTimeout().
                mock.timers.tick(2_147_483_647);
                assert.equal(func.mock.callCount(), 0);
                mock.timers.tick(2_147_483_647);
                assert.equal(func.mock.callCount(), 0);
                mock.timers.tick(1);
                assert.equal(func.mock.callCount(), 1);
            });

            it('should reject when is invoked without "new"', function () {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                // @ts-expect-error
                // eslint-disable-next-line new-cap
                assert.throws(() => At(new Date("2000-01-01T00:01"), func), {
                    name: "TypeError",
                    message:
                        "Class constructor At cannot be invoked without 'new'",
                });

                mock.timers.tick(60_000);
                assert.equal(func.mock.callCount(), 0);
            });
        });

        describe("run()", function () {
            it("should call function", function () {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const at = new At(new Date("2000-01-01T00:01"), func);
                at.run();

                assert.equal(func.mock.callCount(), 1);
            });
        });

        describe("abort()", function () {
            it("should cancel task", function () {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const at = new At(new Date("2000-01-01T00:01"), func);
                at.abort();

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(1);

                assert.equal(func.mock.callCount(), 0);
            });
        });
    });
});
