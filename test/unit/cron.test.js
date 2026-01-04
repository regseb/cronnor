/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import Cron from "../../src/cron.js";

describe("cron.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("Cron", () => {
        describe("constructor()", () => {
            it("should use default values", () => {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const cron = new Cron("1 0 1 1 *", func);
                assert.equal(cron.active, true);

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);

                assert.equal(func.mock.callCount(), 1);
                assert.deepEqual(func.mock.calls[0].this, cron);
                assert.deepEqual(func.mock.calls[0].arguments, []);

                cron.stop();
            });

            it("should not activate task", () => {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const cron = new Cron("1 0 1 1 *", func, { active: false });
                assert.equal(cron.active, false);

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);

                assert.equal(func.mock.callCount(), 0);
            });

            it("should bind thisArg", () => {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const cron = new Cron("1 0 1 1 *", func, { thisArg: "foo" });

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);

                assert.equal(func.mock.callCount(), 1);
                assert.deepEqual(func.mock.calls[0].this, "foo");
                assert.deepEqual(func.mock.calls[0].arguments, []);

                cron.stop();
            });

            it("should bind args", () => {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const cron = new Cron("1 0 1 1 *", func, {
                    args: ["foo", "bar", 42],
                });

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);

                assert.equal(func.mock.callCount(), 1);
                assert.deepEqual(func.mock.calls[0].this, cron);
                assert.deepEqual(func.mock.calls[0].arguments, [
                    "foo",
                    "bar",
                    42,
                ]);

                cron.stop();
            });

            it("should reject when is invoked without 'new'", () => {
                // @ts-expect-error
                // eslint-disable-next-line new-cap
                assert.throws(() => Cron([], () => undefined), {
                    name: "TypeError",
                    message: new RegExp(
                        "^(" +
                            // Vérifier le message d'erreur de Node.js.
                            RegExp.escape(
                                "Class constructor Cron cannot be invoked" +
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
            });
        });

        describe("get active()", () => {
            it("should return 'true' when task is activated", () => {
                const cron = new Cron("0 0 1 1 *", () => undefined);
                assert.equal(cron.active, true);
                cron.stop();
            });

            it("should return 'false' when task is deactivated", () => {
                const cron = new Cron("0 0 1 1 *", () => undefined, {
                    active: false,
                });
                assert.equal(cron.active, false);
            });
        });

        describe("set active()", () => {
            it("should activate with 'true'", () => {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const cron = new Cron("1 0 1 1 *", func, { active: false });
                // eslint-disable-next-line no-multi-assign
                const active = (cron.active = true);
                assert.equal(active, true);

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);

                assert.equal(cron.active, true);
                assert.equal(func.mock.callCount(), 1);

                cron.stop();
            });

            it("should deactivate with 'false'", () => {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const cron = new Cron("1 0 1 1 *", func);
                // eslint-disable-next-line no-multi-assign
                const active = (cron.active = false);
                assert.equal(active, false);

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);

                assert.equal(cron.active, false);
                assert.equal(func.mock.callCount(), 0);
            });
        });

        describe("run()", () => {
            it("should call function", () => {
                const func = mock.fn();
                const cron = new Cron("* * * * *", func, { active: false });
                cron.run();

                assert.equal(func.mock.callCount(), 1);
            });
        });

        describe("start()", () => {
            it("should activate task", () => {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const cron = new Cron("1 0 1 1 *", func, { active: false });
                const changed = cron.start();
                assert.equal(changed, true);

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);

                assert.equal(cron.active, true);
                assert.equal(func.mock.callCount(), 1);

                cron.stop();
            });

            it("should ignore call when task is active", () => {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const cron = new Cron("1 0 1 1 *", func, { active: false });
                let changed = cron.start();
                assert.equal(changed, true);
                changed = cron.start();
                assert.equal(changed, false);

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);

                assert.equal(cron.active, true);
                assert.equal(func.mock.callCount(), 1);

                cron.stop();
            });
        });

        describe("stop()", () => {
            it("should deactivate task", () => {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const cron = new Cron("1 0 1 1 *", func);
                const changed = cron.stop();
                assert.equal(changed, true);

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);

                assert.equal(cron.active, false);
                assert.equal(func.mock.callCount(), 0);
            });

            it("should ignore call when task is deactivated", () => {
                const func = mock.fn();
                mock.timers.enable({
                    apis: ["setTimeout", "Date"],
                    now: new Date("2000-01-01T00:00"),
                });

                const cron = new Cron("1 0 1 1 *", func);
                let changed = cron.stop();
                assert.equal(changed, true);
                changed = cron.stop();
                assert.equal(changed, false);

                // Incrémenter le temps pour le setTimeout().
                mock.timers.tick(60_000);

                assert.equal(cron.active, false);
                assert.equal(func.mock.callCount(), 0);
            });
        });

        describe("test()", () => {
            it("should support one cronex", () => {
                const cron = new Cron("0 0 1 1 *", () => undefined, {
                    active: false,
                });
                assert.ok(cron.test(new Date("2000-01-01T00:00")));
                assert.ok(!cron.test(new Date("2000-01-01T00:01")));
            });

            it("should support many cronexes", () => {
                const cron = new Cron(
                    ["0 0 1 1 *", "59 23 31 12 *"],
                    () => undefined,
                    { active: false },
                );
                assert.ok(cron.test(new Date("2000-01-01T00:00")));
                assert.ok(cron.test(new Date("2000-12-31T23:59")));
                assert.ok(!cron.test(new Date("2000-01-01T00:01")));
                assert.ok(!cron.test(new Date("2000-12-31T23:58")));
            });
        });

        describe("next()", () => {
            it("should support one cronex", () => {
                const cron = new Cron("1 0 1 1 *", () => undefined, {
                    active: false,
                });
                const next = cron.next(new Date("2000-01-01T00:00"));
                assert.deepEqual(next, new Date("2000-01-01T00:01"));
            });

            it("should support many cronexes", () => {
                const cron = new Cron(
                    ["1 0 1 1 *", "59 23 31 12 *"],
                    () => undefined,
                    { active: false },
                );
                let next = cron.next(new Date("2000-01-01T00:00"));
                assert.deepEqual(next, new Date("2000-01-01T00:01"));
                next = cron.next(new Date("2000-12-31T23:58"));
                assert.deepEqual(next, new Date("2000-12-31T23:59"));
            });
        });
    });
});
