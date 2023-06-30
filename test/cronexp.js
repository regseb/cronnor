/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import CronExp from "../src/cronexp.js";

describe("cronexp.js", function () {
    describe("CronExp", function () {
        describe("constructor()", function () {
            it('should support pattern"', function () {
                const cronexp = new CronExp("* 1 2-3 4,5 jun sun");
                assert.ok(cronexp.test(new Date("2000-06-04T02:01:00")));
                assert.ok(cronexp.test(new Date("2000-06-04T02:01:01")));
                assert.ok(cronexp.test(new Date("2000-06-04T03:01:00")));
                assert.ok(cronexp.test(new Date("2000-06-05T02:01:00")));
                assert.ok(cronexp.test(new Date("2000-06-11T02:01:00")));
                assert.ok(cronexp.test(new Date("2001-06-04T02:01:00")));
                assert.ok(!cronexp.test(new Date("2000-06-04T02:00:59")));
                assert.ok(!cronexp.test(new Date("2000-06-04T02:02:00")));
                assert.ok(!cronexp.test(new Date("2000-06-04T04:01:00")));
                assert.ok(!cronexp.test(new Date("2000-06-06T02:01:00")));
                assert.ok(!cronexp.test(new Date("2000-07-04T02:01:00")));
            });

            it("should reject when is invoked without 'new'", function () {
                // @ts-ignore
                // eslint-disable-next-line new-cap
                assert.throws(() => CronExp("* * * * * *"), {
                    name: "TypeError",
                    message:
                        "Class constructor CronExp cannot be invoked without" +
                        " 'new'",
                });
            });
        });

        describe("test()", function () {
            it("should check seconds", function () {
                const cronexp = new CronExp("0 * * * * *");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-01T00:00:01")));
            });

            it("should check minutes", function () {
                const cronexp = new CronExp("* 0 * * * *");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-01T00:01:00")));
            });

            it("should check hours", function () {
                const cronexp = new CronExp("* * 0 * * *");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-01T01:00:00")));
            });

            it("should check month", function () {
                const cronexp = new CronExp("* * * * jan *");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-02-01T00:00:00")));
            });

            it("should check date", function () {
                const cronexp = new CronExp("* * * 1 * *");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-02T00:00:00")));
            });

            it("should check day", function () {
                const cronexp = new CronExp("* * * * * 1");
                assert.ok(cronexp.test(new Date("2000-01-03T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-04T00:00:00")));
            });

            it("should check sunday", function () {
                const cronexp = new CronExp("* * * * * 0");
                assert.ok(cronexp.test(new Date("2000-01-02T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-03T00:00:00")));
            });

            it('should check sunday (with "7")', function () {
                const cronexp = new CronExp("* * * * * 7");
                assert.ok(cronexp.test(new Date("2000-01-02T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-03T00:00:00")));
            });

            it("should check date and day", function () {
                const cronexp = new CronExp("* * * 1 * 1");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(cronexp.test(new Date("2000-01-03T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-02T00:00:00")));
            });

            it("should check date and sunday", function () {
                const cronexp = new CronExp("* * * 1 * 0");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(cronexp.test(new Date("2000-01-02T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-03T00:00:00")));
            });

            it('should check date and sunday (with "7")', function () {
                const cronexp = new CronExp("* * * 1 * 7");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(cronexp.test(new Date("2000-01-02T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-03T00:00:00")));
            });
        });

        describe("next()", function () {
            it("should ignore seconds", function () {
                const cronexp = new CronExp("2 * * * * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:01"));
                assert.deepEqual(next, new Date("2000-01-01T00:00:02"));
            });

            it("should get next seconds", function () {
                const cronexp = new CronExp("2 * * * * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-01T00:00:02"));
            });

            it("should get next seconds with change minutes", function () {
                const cronexp = new CronExp("2 * * * * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:03"));
                assert.deepEqual(next, new Date("2000-01-01T00:01:02"));
            });

            it("should ignore minutes", function () {
                const cronexp = new CronExp("* 2 * * * *");
                const next = cronexp.next(new Date("2000-01-01T00:01:00"));
                assert.deepEqual(next, new Date("2000-01-01T00:02:00"));
            });

            it("should get next minutes", function () {
                const cronexp = new CronExp("* 2 * * * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-01T00:02:00"));
            });

            it("should get next minutes with change hours", function () {
                const cronexp = new CronExp("* 2 * * * *");
                const next = cronexp.next(new Date("2000-01-01T00:03:00"));
                assert.deepEqual(next, new Date("2000-01-01T01:02:00"));
            });

            it("should ignore hours", function () {
                const cronexp = new CronExp("* * 2 * * *");
                const next = cronexp.next(new Date("2000-01-01T02:00:00"));
                assert.deepEqual(next, new Date("2000-01-01T02:00:01"));
            });

            it("should get next hours", function () {
                const cronexp = new CronExp("* * 2 * * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-01T02:00:00"));
            });

            it("should get next hours with change date", function () {
                const cronexp = new CronExp("* * 2 * * *");
                const next = cronexp.next(new Date("2000-01-01T03:00:00"));
                assert.deepEqual(next, new Date("2000-01-02T02:00:00"));
            });

            it("should ignore date", function () {
                const cronexp = new CronExp("* * * 3 * *");
                const next = cronexp.next(new Date("2000-01-03T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-03T00:00:01"));
            });

            it("should get next date", function () {
                const cronexp = new CronExp("* * * 3 * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-03T00:00:00"));
            });

            it("should get next date (which is the last date of the month)", function () {
                const cronexp = new CronExp("* * * 31 * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-31T00:00:00"));
            });

            it("should get next date with change month", function () {
                let cronexp = new CronExp("* * * 3 * *");
                let next = cronexp.next(new Date("2000-01-04T00:00:00"));
                assert.deepEqual(next, new Date("2000-02-03T00:00:00"));

                cronexp = new CronExp("* * * 30 * *");
                next = cronexp.next(new Date("2000-02-29T00:00:00"));
                assert.deepEqual(next, new Date("2000-03-30T00:00:00"));
            });

            it("should ignore day", function () {
                const cronexp = new CronExp("* * * * * 2");
                const next = cronexp.next(new Date("2000-01-04T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-04T00:00:01"));
            });

            it("should get next day", function () {
                const cronexp = new CronExp("* * * * * 2");
                const next = cronexp.next(new Date("2000-01-02T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-04T00:00:00"));
            });

            it("should get next day (without being the first day)", function () {
                const cronexp = new CronExp("* * * * * 1,3");
                const next = cronexp.next(new Date("2000-01-04T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-05T00:00:00"));
            });

            it("should get next day with change week", function () {
                const cronexp = new CronExp("* * * * * 2");
                const next = cronexp.next(new Date("2000-01-05T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-11T00:00:00"));
            });

            it("should ignore date and day", function () {
                const cronexp = new CronExp("* * * 3 * 2");
                const next = cronexp.next(new Date("2000-10-03T00:00:00"));
                assert.deepEqual(next, new Date("2000-10-03T00:00:01"));
            });

            it("should get next date (with day restricted)", function () {
                const cronexp = new CronExp("* * * 3 * 2");
                const next = cronexp.next(new Date("2000-01-02T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-03T00:00:00"));
            });

            it("should get next day (with date restricted)", function () {
                const cronexp = new CronExp("* * * 3 * 2");
                const next = cronexp.next(new Date("2000-01-10T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-11T00:00:00"));
            });

            it("should ignore month", function () {
                const cronexp = new CronExp("* * * * 3 *");
                const next = cronexp.next(new Date("2000-03-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-03-01T00:00:01"));
            });

            it("should get next month", function () {
                const cronexp = new CronExp("* * * * 3 *");
                const next = cronexp.next(new Date("2000-01-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-03-01T00:00:00"));
            });

            it("should get next month with change year", function () {
                const cronexp = new CronExp("* * * * 3 *");
                const next = cronexp.next(new Date("2000-04-01T00:00:00"));
                assert.deepEqual(next, new Date("2001-03-01T00:00:00"));
            });
        });
    });
});
