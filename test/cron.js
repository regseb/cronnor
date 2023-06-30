/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import Cron from "../src/cron.js";

describe("cron.js", function () {
    describe("Cron", function () {
        describe("constructor()", function () {
            it("should use default values", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake);
                assert.equal(cron.active, true);

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(fake.callCount, 1);
                assert.deepEqual(fake.firstCall.thisValue, cron);
                assert.deepEqual(fake.firstCall.args, []);

                cron.stop();
            });

            it("should not activate task", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake, { active: false });
                assert.equal(cron.active, false);

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(fake.callCount, 0);
            });

            it("should bind thisArg", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake, { thisArg: "foo" });

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(fake.callCount, 1);
                assert.deepEqual(fake.firstCall.thisValue, "foo");
                assert.deepEqual(fake.firstCall.args, []);

                cron.stop();
            });

            it("should bind args", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake, {
                    args: ["foo", "bar", 42],
                });

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(fake.callCount, 1);
                assert.deepEqual(fake.firstCall.thisValue, cron);
                assert.deepEqual(fake.firstCall.args, ["foo", "bar", 42]);

                cron.stop();
            });

            it("should reject when is invoked without 'new'", function () {
                // @ts-ignore
                // eslint-disable-next-line new-cap
                assert.throws(() => Cron([], () => {}), {
                    name: "TypeError",
                    message:
                        "Class constructor Cron cannot be invoked without" +
                        " 'new'",
                });
            });
        });

        describe("get active()", function () {
            it("should return 'true' when task is actived", function () {
                const cron = new Cron("0 0 1 1 *", () => {});
                assert.equal(cron.active, true);
                cron.stop();
            });

            it("should return 'false' when task is deactived", function () {
                const cron = new Cron("0 0 1 1 *", () => {}, { active: false });
                assert.equal(cron.active, false);
            });
        });

        describe("set active()", function () {
            it("should activate with 'true'", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake, { active: false });
                // eslint-disable-next-line no-multi-assign
                const active = (cron.active = true);
                assert.equal(active, true);

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(cron.active, true);
                assert.equal(fake.callCount, 1);

                cron.stop();
            });

            it("should deactivate with 'false'", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake);
                // eslint-disable-next-line no-multi-assign
                const active = (cron.active = false);
                assert.equal(active, false);

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(cron.active, false);
                assert.equal(fake.callCount, 0);
            });
        });

        describe("run()", function () {
            it("should call function", function () {
                const fake = sinon.fake();
                const cron = new Cron("* * * * *", fake, { active: false });
                cron.run();

                assert.equal(fake.callCount, 1);
            });
        });

        describe("start()", function () {
            it("should activate task", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake, { active: false });
                const changed = cron.start();
                assert.equal(changed, true);

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(cron.active, true);
                assert.equal(fake.callCount, 1);

                cron.stop();
            });

            it("should ignore call when task is active", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake, { active: false });
                let changed = cron.start();
                assert.equal(changed, true);
                changed = cron.start();
                assert.equal(changed, false);

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(cron.active, true);
                assert.equal(fake.callCount, 1);

                cron.stop();
            });
        });

        describe("stop()", function () {
            it("should deactivate task", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake);
                const changed = cron.stop();
                assert.equal(changed, true);

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(cron.active, false);
                assert.equal(fake.callCount, 0);
            });

            it("should ignore call when task is deactive", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake);
                let changed = cron.stop();
                assert.equal(changed, true);
                changed = cron.stop();
                assert.equal(changed, false);

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(cron.active, false);
                assert.equal(fake.callCount, 0);
            });
        });

        describe("test()", function () {
            it("should support one cronex", function () {
                const cron = new Cron("0 0 1 1 *", () => {}, { active: false });
                assert.ok(cron.test(new Date("2000-01-01T00:00")));
                assert.ok(!cron.test(new Date("2000-01-01T00:01")));
            });

            it("should support many cronexes", function () {
                const cron = new Cron(
                    ["0 0 1 1 *", "59 23 31 12 *"],
                    () => {},
                    { active: false },
                );
                assert.ok(cron.test(new Date("2000-01-01T00:00")));
                assert.ok(cron.test(new Date("2000-12-31T23:59")));
                assert.ok(!cron.test(new Date("2000-01-01T00:01")));
                assert.ok(!cron.test(new Date("2000-12-31T23:58")));
            });
        });

        describe("next()", function () {
            it("should support one cronex", function () {
                const cron = new Cron("1 0 1 1 *", () => {}, { active: false });
                const next = cron.next(new Date("2000-01-01T00:00"));
                assert.deepEqual(next, new Date("2000-01-01T00:01"));
            });

            it("should support many cronexes", function () {
                const cron = new Cron(
                    ["1 0 1 1 *", "59 23 31 12 *"],
                    () => {},
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
