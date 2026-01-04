/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import CronExp from "../../src/cronexp.js";

describe("cronexp.js", () => {
    describe("CronExp", () => {
        describe("constructor()", () => {
            it('should support pattern"', () => {
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

            it("should reject when is invoked without 'new'", () => {
                // @ts-expect-error
                // eslint-disable-next-line new-cap
                assert.throws(() => CronExp("* * * * * *"), {
                    name: "TypeError",
                    message: new RegExp(
                        "^(" +
                            // Vérifier le message d'erreur de Node.js.
                            RegExp.escape(
                                "Class constructor CronExp cannot be invoked" +
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

        describe("test()", () => {
            it("should check seconds", () => {
                const cronexp = new CronExp("0 * * * * *");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-01T00:00:01")));
            });

            it("should check minutes", () => {
                const cronexp = new CronExp("* 0 * * * *");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-01T00:01:00")));
            });

            it("should check hours", () => {
                const cronexp = new CronExp("* * 0 * * *");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-01T01:00:00")));
            });

            it("should check month", () => {
                const cronexp = new CronExp("* * * * jan *");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-02-01T00:00:00")));
            });

            it("should check date", () => {
                const cronexp = new CronExp("* * * 1 * *");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-02T00:00:00")));
            });

            it("should check day", () => {
                const cronexp = new CronExp("* * * * * 1");
                assert.ok(cronexp.test(new Date("2000-01-03T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-04T00:00:00")));
            });

            it("should check sunday", () => {
                const cronexp = new CronExp("* * * * * 0");
                assert.ok(cronexp.test(new Date("2000-01-02T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-03T00:00:00")));
            });

            it('should check sunday (with "7")', () => {
                const cronexp = new CronExp("* * * * * 7");
                assert.ok(cronexp.test(new Date("2000-01-02T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-03T00:00:00")));
            });

            it("should check date and day", () => {
                const cronexp = new CronExp("* * * 1 * 1");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(cronexp.test(new Date("2000-01-03T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-02T00:00:00")));
            });

            it("should check date and sunday", () => {
                const cronexp = new CronExp("* * * 1 * 0");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(cronexp.test(new Date("2000-01-02T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-03T00:00:00")));
            });

            it('should check date and sunday (with "7")', () => {
                const cronexp = new CronExp("* * * 1 * 7");
                assert.ok(cronexp.test(new Date("2000-01-01T00:00:00")));
                assert.ok(cronexp.test(new Date("2000-01-02T00:00:00")));
                assert.ok(!cronexp.test(new Date("2000-01-03T00:00:00")));
            });
        });

        describe("next()", () => {
            it("should ignore seconds", () => {
                const cronexp = new CronExp("2 * * * * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:01"));
                assert.deepEqual(next, new Date("2000-01-01T00:00:02"));
            });

            it("should get next seconds", () => {
                const cronexp = new CronExp("2 * * * * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-01T00:00:02"));
            });

            it("should get next seconds with change minutes", () => {
                const cronexp = new CronExp("2 * * * * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:03"));
                assert.deepEqual(next, new Date("2000-01-01T00:01:02"));
            });

            it("should ignore minutes", () => {
                const cronexp = new CronExp("* 2 * * * *");
                const next = cronexp.next(new Date("2000-01-01T00:01:00"));
                assert.deepEqual(next, new Date("2000-01-01T00:02:00"));
            });

            it("should get next minutes", () => {
                const cronexp = new CronExp("* 2 * * * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-01T00:02:00"));
            });

            it("should get next minutes with change hours", () => {
                const cronexp = new CronExp("* 2 * * * *");
                const next = cronexp.next(new Date("2000-01-01T00:03:00"));
                assert.deepEqual(next, new Date("2000-01-01T01:02:00"));
            });

            it("should ignore hours", () => {
                const cronexp = new CronExp("* * 2 * * *");
                const next = cronexp.next(new Date("2000-01-01T02:00:00"));
                assert.deepEqual(next, new Date("2000-01-01T02:00:01"));
            });

            it("should get next hours", () => {
                const cronexp = new CronExp("* * 2 * * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-01T02:00:00"));
            });

            it("should get next hours with change date", () => {
                const cronexp = new CronExp("* * 2 * * *");
                const next = cronexp.next(new Date("2000-01-01T03:00:00"));
                assert.deepEqual(next, new Date("2000-01-02T02:00:00"));
            });

            it("should ignore date", () => {
                const cronexp = new CronExp("* * * 3 * *");
                const next = cronexp.next(new Date("2000-01-03T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-03T00:00:01"));
            });

            it("should get next date", () => {
                const cronexp = new CronExp("* * * 3 * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-03T00:00:00"));
            });

            // Détecter les mutations dans la méthode CronExp#nextDate() :
            // - date.setMinutes(this.#minutes.min);
            // + date.setHours(this.#minutes.min);
            // et :
            // - date.setHours(this.#hours.min);
            // + date.setMinutes(this.#hours.min);
            it("should get next date and don't shuffle time fields", () => {
                const cronexp = new CronExp("30,31 20,21 10,11 3 * *");
                const next = cronexp.next(new Date("2000-01-01T11:21:30"));
                assert.deepEqual(next, new Date("2000-01-03T10:20:30"));
            });

            // Détecter la mutation dans la méthode CronExp#nextDate() :
            // - next >
            // -     new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
            // + next >= new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
            it("should get next date (which is the last date of the month)", () => {
                const cronexp = new CronExp("* * * 31 * *");
                const next = cronexp.next(new Date("2000-01-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-31T00:00:00"));
            });

            it("should get next date with change month", () => {
                let cronexp = new CronExp("* * * 3 * *");
                let next = cronexp.next(new Date("2000-01-04T00:00:00"));
                assert.deepEqual(next, new Date("2000-02-03T00:00:00"));

                cronexp = new CronExp("* * * 30 * *");
                next = cronexp.next(new Date("2000-02-29T00:00:00"));
                assert.deepEqual(next, new Date("2000-03-30T00:00:00"));
            });

            it("should ignore day", () => {
                const cronexp = new CronExp("* * * * * 2");
                const next = cronexp.next(new Date("2000-01-04T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-04T00:00:01"));
            });

            it("should get next day", () => {
                const cronexp = new CronExp("* * * * * 2");
                const next = cronexp.next(new Date("2000-01-02T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-04T00:00:00"));
            });

            // Détecter les mutations dans la méthode CronExp#nextDay() :
            // - date.setMinutes(this.#minutes.min);
            // + date.setHours(this.#minutes.min);
            // et :
            // - date.setHours(this.#hours.min);
            // + date.setMinutes(this.#hours.min);
            it("should get next day and don't shuffle time fields", () => {
                const cronexp = new CronExp("30,31 20,21 10,11 * * 2");
                const next = cronexp.next(new Date("2000-01-02T11:21:30"));
                assert.deepEqual(next, new Date("2000-01-04T10:20:30"));
            });

            it("should get next day (without being the first day)", () => {
                const cronexp = new CronExp("* * * * * 1,3");
                const next = cronexp.next(new Date("2000-01-04T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-05T00:00:00"));
            });

            it("should get next day with change week", () => {
                const cronexp = new CronExp("* * * * * 2");
                const next = cronexp.next(new Date("2000-01-05T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-11T00:00:00"));
            });

            it("should ignore date and day", () => {
                const cronexp = new CronExp("* * * 3 * 2");
                const next = cronexp.next(new Date("2000-10-03T00:00:00"));
                assert.deepEqual(next, new Date("2000-10-03T00:00:01"));
            });

            it("should get next date (with day restricted)", () => {
                const cronexp = new CronExp("* * * 3 * 2");
                const next = cronexp.next(new Date("2000-01-02T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-03T00:00:00"));
            });

            it("should get next day (with date restricted)", () => {
                const cronexp = new CronExp("* * * 3 * 2");
                const next = cronexp.next(new Date("2000-01-10T00:00:00"));
                assert.deepEqual(next, new Date("2000-01-11T00:00:00"));
            });

            it("should ignore month", () => {
                const cronexp = new CronExp("* * * * 3 *");
                const next = cronexp.next(new Date("2000-03-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-03-01T00:00:01"));
            });

            it("should get next month", () => {
                const cronexp = new CronExp("* * * * 3 *");
                const next = cronexp.next(new Date("2000-01-01T00:00:00"));
                assert.deepEqual(next, new Date("2000-03-01T00:00:00"));
            });

            // Détecter les mutations dans la méthode CronExp#nextMonth() :
            // - date.setMinutes(this.#minutes.min);
            // + date.setHours(this.#minutes.min);
            // et :
            // - date.setHours(this.#hours.min);
            // + date.setMinutes(this.#hours.min);
            it("should get next month and don't shuffle time fields", () => {
                const cronexp = new CronExp("30,31 20,21 10,11 * 3 *");
                const next = cronexp.next(new Date("2000-01-01T11:21:30"));
                assert.deepEqual(next, new Date("2000-03-01T10:20:30"));
            });

            it("should get next month with change year", () => {
                const cronexp = new CronExp("* * * * 3 *");
                const next = cronexp.next(new Date("2000-04-01T00:00:00"));
                assert.deepEqual(next, new Date("2001-03-01T00:00:00"));
            });
        });
    });
});
