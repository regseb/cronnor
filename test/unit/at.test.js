/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import At from "../../src/at.js";

describe("at.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("At", () => {
        describe("constructor()", () => {
            it("should use default values", () => {
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

            it("should bind thisArg", () => {
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

            it("should bind args", () => {
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

            it("should set one interval", () => {
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

            it("should set exactly one interval", () => {
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

            it("should add intermediate steps", () => {
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

            it("should add many intermediate steps", () => {
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

            it('should reject when is invoked without "new"', () => {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                // @ts-expect-error
                // eslint-disable-next-line new-cap
                assert.throws(() => At(new Date("2000-01-01T00:01"), func), {
                    name: "TypeError",
                    message: new RegExp(
                        "^(" +
                            // Vérifier le message d'erreur de Node.js.
                            RegExp.escape(
                                "Class constructor At cannot be invoked" +
                                    " without 'new'",
                            ) +
                            ")|(" +
                            // Vérifier le message d'erreur de Bun.
                            RegExp.escape(
                                "Cannot call a class constructor without |new|",
                            ) +
                            ")$",
                        "v",
                    ),
                });

                mock.timers.tick(60_000);
                assert.equal(func.mock.callCount(), 0);
            });
        });

        describe("run()", () => {
            it("should call function", () => {
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

        describe("abort()", () => {
            it("should cancel task", () => {
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
