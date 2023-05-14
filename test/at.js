/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import At from "../src/at.js";

describe("at.js", function () {
    describe("At", function () {
        describe("constructor()", function () {
            it("should use default values", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const at = new At(new Date("2000-01-01T00:01"), fake);

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(fake.callCount, 1);
                assert.deepEqual(fake.firstCall.thisValue, at);
                assert.deepEqual(fake.firstCall.args, []);

                clock.restore();
            });

            it("should bind thisArg", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                // eslint-disable-next-line no-new
                new At(new Date("2000-01-01T00:01"), fake, { thisArg: "foo" });

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(fake.callCount, 1);
                assert.deepEqual(fake.firstCall.thisValue, "foo");
                assert.deepEqual(fake.firstCall.args, []);

                clock.restore();
            });

            it("should bind args", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const at = new At(new Date("2000-01-01T00:01"), fake, {
                    args: ["foo", "bar", 42],
                });

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(fake.callCount, 1);
                assert.deepEqual(fake.firstCall.thisValue, at);
                assert.deepEqual(fake.firstCall.args, ["foo", "bar", 42]);

                clock.restore();
            });

            it("should set one interval", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                // eslint-disable-next-line no-new
                new At(new Date("2000-01-01T00:01"), fake);

                // Incrémenter le temps pour le setTimeout().
                clock.next();
                assert.equal(fake.callCount, 1);
                clock.next();
                assert.equal(fake.callCount, 1);

                clock.restore();
            });

            it("should set exactly one interval", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                // eslint-disable-next-line no-new
                new At(new Date("2000-01-25T20:31:23.647"), fake);

                // Incrémenter le temps pour le setTimeout().
                clock.next();
                assert.equal(fake.callCount, 1);

                clock.restore();
            });

            it("should add intermediate steps", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                // eslint-disable-next-line no-new
                new At(new Date("2000-01-25T20:31:23.648"), fake);

                // Incrémenter deux fois le temps pour les setTimeout().
                clock.next();
                assert.equal(fake.callCount, 0);
                clock.next();
                assert.equal(fake.callCount, 1);

                clock.restore();
            });

            it("should add many intermediate steps", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                // eslint-disable-next-line no-new
                new At(new Date("2000-02-19T17:02:47.295"), fake);

                // Incrémenter trois fois le temps pour les setTimeout().
                clock.next();
                assert.equal(fake.callCount, 0);
                clock.next();
                assert.equal(fake.callCount, 0);
                clock.next();
                assert.equal(fake.callCount, 1);

                clock.restore();
            });

            it('should reject when is invoked without "new"', function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                // @ts-ignore
                // eslint-disable-next-line new-cap
                assert.throws(() => At(new Date("2000-01-01T00:01"), fake), {
                    name: "TypeError",
                    message:
                        "Class constructor At cannot be invoked without 'new'",
                });

                clock.next();
                assert.equal(fake.callCount, 0);

                clock.restore();
            });
        });

        describe("run()", function () {
            it("should call function", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const at = new At(new Date("2000-01-01T00:01"), fake);
                at.run();

                assert.equal(fake.callCount, 1);

                clock.restore();
            });
        });

        describe("abort()", function () {
            it("should cancel task", function () {
                const fake = sinon.fake();
                const clock = sinon.useFakeTimers(new Date("2000-01-01T00:00"));

                const at = new At(new Date("2000-01-01T00:01"), fake);
                at.abort();

                // Incrémenter le temps pour le setTimeout().
                clock.next();

                assert.equal(fake.callCount, 0);

                clock.restore();
            });
        });
    });
});
