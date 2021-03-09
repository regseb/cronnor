import assert   from "assert";
import sinon    from "sinon";
import { Cron } from "../src/cron.js";

describe("cron.js", function () {
    describe("Cron", function () {
        describe("get active()", function () {
            it("should return 'true' when task is actived", function () {
                const cron = new Cron("0 0 1 1 *", () => {});
                assert.ok(cron.active);
                cron.stop();
            });

            it("should return 'false' when task is deactived", function () {
                const cron = new Cron("0 0 1 1 *", () => {}, false);
                assert.ok(!cron.active);
            });

            it("should return 'true' when task is actived with no cronexp",
                                                                   function () {
                const cron = new Cron([], () => {});
                assert.ok(cron.active);
            });
        });

        describe("bind()", function () {
            it("should pass thisArg", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake, false);
                const clone = cron.bind("foo");
                assert.deepStrictEqual(clone, cron);
                cron.start();

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.strictEqual(fake.callCount, 1);
                assert.deepStrictEqual(fake.firstCall.thisValue, "foo");
                assert.deepStrictEqual(fake.firstCall.args, []);

                cron.stop();
                clock.restore();
            });

            it("should pass thisArg and arguments", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake, false);
                const clone = cron.bind("foo", "bar", 42);
                assert.deepStrictEqual(clone, cron);
                cron.start();

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.strictEqual(fake.callCount, 1);
                assert.deepStrictEqual(fake.firstCall.thisValue, "foo");
                assert.deepStrictEqual(fake.firstCall.args, ["bar", 42]);

                cron.stop();
                clock.restore();
            });
        });

        describe("unbind()", function () {
            it("should reset thisArg and arguments", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake, false);
                cron.bind("foo", "bar", "baz");
                const clone = cron.unbind();
                assert.deepStrictEqual(clone, cron);
                cron.start();

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.strictEqual(fake.callCount, 1);
                assert.deepStrictEqual(fake.firstCall.thisValue, cron);
                assert.deepStrictEqual(fake.firstCall.args, []);

                cron.stop();
                clock.restore();
            });
        });

        describe("withArguments()", function () {
            it("should accept no argument", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake, false);
                const clone = cron.withArguments();
                assert.deepStrictEqual(clone, cron);
                cron.start();

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.strictEqual(fake.callCount, 1);
                assert.deepStrictEqual(fake.firstCall.thisValue, cron);
                assert.deepStrictEqual(fake.firstCall.args, []);

                cron.stop();
                clock.restore();
            });

            it("should pass arguments", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake, false);
                const clone = cron.withArguments("foo", "bar", 42);
                assert.deepStrictEqual(clone, cron);
                cron.start();

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.strictEqual(fake.callCount, 1);
                assert.deepStrictEqual(fake.firstCall.thisValue, cron);
                assert.deepStrictEqual(fake.firstCall.args, ["foo", "bar", 42]);

                cron.stop();
                clock.restore();
            });
        });

        describe("run()", function () {
            it("should call function", function () {
                const fake = sinon.fake();
                const cron = new Cron("* * * * *", fake, false);
                cron.run();

                assert.strictEqual(fake.callCount, 1);
            });
        });

        describe("start()", function () {
            it("should enable task when no cronexp", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron([], fake, false);
                cron.start();

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.ok(cron.active);
                assert.strictEqual(fake.callCount, 0);

                cron.stop();
                clock.restore();
            });

            it("should enable task", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake, false);
                cron.start();

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.ok(cron.active);
                assert.strictEqual(fake.callCount, 1);

                cron.stop();
                clock.restore();
            });

            it("should ignore call when task is enabled", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake, false);
                cron.start();
                cron.start();

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.ok(cron.active);
                assert.strictEqual(fake.callCount, 1);

                cron.stop();
                clock.restore();
            });

            it("should set one interval", function () {
                const fake1 = sinon.fake();
                const fake2 = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron1 = new Cron("1 0 1 1 *", fake1, false);
                cron1.start();
                const cron2 = new Cron("1 0 1 1 *", fake2, false);
                cron2.start();

                // Incrémenter le temps pour les setTimeout().
                clock.next();
                clock.next();

                assert.ok(cron1.active);
                assert.ok(cron2.active);
                assert.strictEqual(fake1.callCount, 1);
                assert.strictEqual(fake2.callCount, 1);

                cron1.stop();
                cron2.stop();
                clock.restore();
            });

            it("should add intermediate steps", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                // Tester au 26 car le délai maximum supporté par Node.js est
                // d'environ 25 jours.
                const cron = new Cron("0 0 26 1 *", fake, false);
                cron.start();

                // Incrémenter deux fois le temps pour le setTimeout().
                clock.next();
                clock.next();

                assert.ok(cron.active);
                assert.strictEqual(fake.callCount, 1);

                cron.stop();
                clock.restore();
            });
        });

        describe("stop()", function () {
            it("should disable task when no cronexp", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron([], fake);
                cron.stop();

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.ok(!cron.active);
                assert.strictEqual(fake.callCount, 0);

                clock.restore();
            });

            it("should disable task", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake);
                cron.stop();

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.ok(!cron.active);
                assert.strictEqual(fake.callCount, 0);

                clock.restore();
            });

            it("should ignore call when task is disabled", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron = new Cron("1 0 1 1 *", fake);
                cron.stop();
                cron.stop();

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.ok(!cron.active);
                assert.strictEqual(fake.callCount, 0);

                clock.restore();
            });

            it("should clear one interval", function () {
                const fake1 = sinon.fake();
                const fake2 = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const cron1 = new Cron("1 0 1 1 *", fake1);
                cron1.stop();
                const cron2 = new Cron("1 0 1 1 *", fake2);
                cron2.stop();

                // Incrémenter le temps pour les setTimeout().
                clock.next();
                clock.next();

                assert.ok(!cron1.active);
                assert.ok(!cron2.active);
                assert.strictEqual(fake1.callCount, 0);
                assert.strictEqual(fake2.callCount, 0);

                clock.restore();
            });
        });

        describe("test()", function () {
            it("should support no cronexp", function () {
                const cron = new Cron([], () => {}, false);
                assert.ok(!cron.test(new Date("2000-01-01T00:00")));
            });

            it("should support one cronexp", function () {
                const cron = new Cron("0 0 1 1 *", () => {}, false);
                assert.ok(cron.test(new Date("2000-01-01T00:00")));
                assert.ok(!cron.test(new Date("2000-01-01T00:01")));
            });

            it("should support many cronexps", function () {
                const cron = new Cron(["0 0 1 1 *", "59 23 31 12 *"],
                                      () => {},
                                      false);
                assert.ok(cron.test(new Date("2000-01-01T00:00")));
                assert.ok(cron.test(new Date("2000-12-31T23:59")));
                assert.ok(!cron.test(new Date("2000-01-01T00:01")));
                assert.ok(!cron.test(new Date("2000-12-31T23:58")));
            });
        });

        describe("next()", function () {
            it("should support no cronexp", function () {
                const cron = new Cron([], () => {}, false);
                const next = cron.next(new Date("2000-01-01T00:00"));
                assert.strictEqual(next, undefined);
            });

            it("should support one cronexp", function () {
                const cron = new Cron("1 0 1 1 *", () => {}, false);
                const next = cron.next(new Date("2000-01-01T00:00"));
                assert.deepStrictEqual(next, new Date("2000-01-01T00:01"));
            });

            it("should support many cronexps", function () {
                const cron = new Cron(["1 0 1 1 *", "59 23 31 12 *"],
                                      () => {},
                                      false);
                let next = cron.next(new Date("2000-01-01T00:00"));
                assert.deepStrictEqual(next, new Date("2000-01-01T00:01"));
                next = cron.next(new Date("2000-12-31T23:58"));
                assert.deepStrictEqual(next, new Date("2000-12-31T23:59"));
            });
        });
    });
});
