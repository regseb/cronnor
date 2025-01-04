/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import parse from "../src/parse.js";

/**
 * Génère les valeurs d'un intervalle.
 *
 * @param {number} min    La valeur minimale (incluse) de l'intervalle.
 * @param {number} max    La valeur maximale (incluse) de l'intervalle.
 * @param {number} [step] Le pas entre les valeurs (`1` par défaut).
 * @returns {number[]} La liste des valeurs.
 */
const range = (min, max, step = 1) => {
    const values = [];
    for (let value = min; value <= max; value += step) {
        values.push(value);
    }
    return values;
};

describe("parse.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("parse()", function () {
        it('should support "@yearly"', function () {
            const fields = parse("@yearly");
            assert.deepEqual(fields.seconds.values(), [0]);
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [0]);
            assert.deepEqual(fields.date.values(), [1]);
            assert.deepEqual(fields.month.values(), [0]);
            assert.ok(!fields.day.restricted);
        });

        it('should support "@annually"', function () {
            const fields = parse("@annually");
            assert.deepEqual(fields.seconds.values(), [0]);
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [0]);
            assert.deepEqual(fields.date.values(), [1]);
            assert.deepEqual(fields.month.values(), [0]);
            assert.ok(!fields.day.restricted);
        });

        it('should support "@monthly"', function () {
            const fields = parse("@monthly");
            assert.deepEqual(fields.seconds.values(), [0]);
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [0]);
            assert.deepEqual(fields.date.values(), [1]);
            assert.ok(!fields.month.restricted);
            assert.ok(!fields.day.restricted);
        });

        it('should support "@weekly"', function () {
            const fields = parse("@weekly");
            assert.deepEqual(fields.seconds.values(), [0]);
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [0]);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [0]);
        });

        it('should support "@daily"', function () {
            const fields = parse("@daily");
            assert.deepEqual(fields.seconds.values(), [0]);
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [0]);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.ok(!fields.day.restricted);
        });

        it('should support "@midnight"', function () {
            const fields = parse("@midnight");
            assert.deepEqual(fields.seconds.values(), [0]);
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [0]);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.ok(!fields.day.restricted);
        });

        it('should support "@hourly"', function () {
            const fields = parse("@hourly");
            assert.deepEqual(fields.seconds.values(), [0]);
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.ok(!fields.day.restricted);
        });

        it("should support uppercase nicknames", function () {
            const fields = parse("@HOURLY");
            assert.deepEqual(fields.seconds.values(), [0]);
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.ok(!fields.day.restricted);
        });

        it("should reject when too many fields", function () {
            assert.throws(() => parse("* * * * * * *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * * * * * *",
            });
        });

        it("should reject when not enough fields", function () {
            assert.throws(() => parse("* * * *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * * *",
            });
        });

        it("should support many whitespaces", function () {
            const fields = parse("* *  *   *    *\t\u00A0*");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.ok(!fields.day.restricted);
        });

        it('should use "0" by default to seconds', function () {
            const fields = parse("* * * * *");
            assert.deepEqual(fields.seconds.values(), [0]);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.ok(!fields.day.restricted);
        });

        it("should reject invalide field", function () {
            assert.throws(() => parse("& * * * * *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: & * * * * *",
            });
            assert.throws(() => parse("* = * * * *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * = * * * *",
            });
            assert.throws(() => parse("* * $ * * *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * $ * * *",
            });
            assert.throws(() => parse("* * * ^ * *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * * ^ * *",
            });
            assert.throws(() => parse("* * * * février *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * * février *",
            });
            assert.throws(() => parse("* * * * * #"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * * * * #",
            });
        });

        it('should support "*"', function () {
            const fields = parse("* * * * * *");
            assert.deepEqual(fields.seconds.values(), range(0, 59));
            assert.ok(!fields.seconds.restricted);
            assert.deepEqual(fields.minutes.values(), range(0, 59));
            assert.ok(!fields.minutes.restricted);
            assert.deepEqual(fields.hours.values(), range(0, 23));
            assert.ok(!fields.hours.restricted);
            assert.deepEqual(fields.date.values(), range(1, 31));
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), range(0, 11));
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), range(0, 6));
            assert.ok(!fields.day.restricted);
        });

        it('should support "*/{step}"', function () {
            const fields = parse("*/1 */2 */3 */15 */12 */10");
            assert.deepEqual(fields.seconds.values(), range(0, 59));
            assert.deepEqual(fields.minutes.values(), range(0, 59, 2));
            assert.deepEqual(fields.hours.values(), range(0, 23, 3));
            assert.deepEqual(fields.date.values(), [1, 16, 31]);
            assert.deepEqual(fields.month.values(), [0]);
            assert.deepEqual(fields.day.values(), [0]);
        });

        it('should support month "jan"', function () {
            const fields = parse("* * * * jan *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [0]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "feb"', function () {
            const fields = parse("* * * * feb *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [1]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "mar"', function () {
            const fields = parse("* * * * mar *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [2]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "apr"', function () {
            const fields = parse("* * * * apr *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [3]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "may"', function () {
            const fields = parse("* * * * may *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [4]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "jun"', function () {
            const fields = parse("* * * * jun *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [5]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "jul"', function () {
            const fields = parse("* * * * jul *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [6]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "aug"', function () {
            const fields = parse("* * * * aug *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [7]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "sep"', function () {
            const fields = parse("* * * * sep *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [8]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "oct"', function () {
            const fields = parse("* * * * oct *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [9]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "nov"', function () {
            const fields = parse("* * * * nov *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [10]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "dec"', function () {
            const fields = parse("* * * * dec *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [11]);
            assert.ok(!fields.day.restricted);
        });

        it("should support literal uppercase month", function () {
            const fields = parse("* * * * DEC *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [11]);
            assert.ok(!fields.day.restricted);
        });

        it("should reject literal invalid month", function () {
            assert.throws(() => parse("* * * * foo *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * * * foo *",
            });
        });

        it('should support day "sun"', function () {
            const fields = parse("* * * * * sun");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [0]);
        });

        it('should support day "mon"', function () {
            const fields = parse("* * * * * mon");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [1]);
        });

        it('should support day "tue"', function () {
            const fields = parse("* * * * * tue");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [2]);
        });

        it('should support day "wed"', function () {
            const fields = parse("* * * * * wed");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [3]);
        });

        it('should support day "thu"', function () {
            const fields = parse("* * * * * thu");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [4]);
        });

        it('should support day "fri"', function () {
            const fields = parse("* * * * * fri");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [5]);
        });

        it('should support day "sat"', function () {
            const fields = parse("* * * * * sat");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [6]);
        });

        it("should support literal uppercase day", function () {
            const fields = parse("* * * * * SAT");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [6]);
        });

        it("should reject literal invalid day", function () {
            assert.throws(() => parse("* * * * * foo"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * * * * foo",
            });
        });

        it('should support many sub-fields"', function () {
            const fields = parse("1,2 3,4 5,6 7,8 9,10 0,1");
            assert.deepEqual(fields.seconds.values(), [1, 2]);
            assert.deepEqual(fields.minutes.values(), [3, 4]);
            assert.deepEqual(fields.hours.values(), [5, 6]);
            assert.deepEqual(fields.date.values(), [7, 8]);
            assert.deepEqual(fields.month.values(), [8, 9]);
            assert.deepEqual(fields.day.values(), [0, 1]);
        });

        it('should support "{min}"', function () {
            const fields = parse("1 2 3 4 5 6");
            assert.deepEqual(fields.seconds.values(), [1]);
            assert.deepEqual(fields.minutes.values(), [2]);
            assert.deepEqual(fields.hours.values(), [3]);
            assert.deepEqual(fields.date.values(), [4]);
            assert.deepEqual(fields.month.values(), [4]);
            assert.deepEqual(fields.day.values(), [6]);
        });

        it('should support "?"', function () {
            mock.timers.enable({
                apis: ["Date"],
                now: new Date("2000-01-02T03:04:05"),
            });

            const fields = parse("? ? ? ? ? ?");
            assert.deepEqual(fields.seconds.values(), [5]);
            assert.deepEqual(fields.minutes.values(), [4]);
            assert.deepEqual(fields.hours.values(), [3]);
            assert.deepEqual(fields.date.values(), [2]);
            assert.deepEqual(fields.month.values(), [0]);
            assert.deepEqual(fields.day.values(), [0]);
        });

        it("should reject prefix", function () {
            assert.throws(() => parse("foo0 * * * * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: foo0 * * * * *",
            });
            assert.throws(() => parse("* bar0 * * * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * bar0 * * * *",
            });
            assert.throws(() => parse("* * baz0 * * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * baz0 * * *",
            });
            assert.throws(() => parse("* * * qux1 * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * qux1 * *",
            });
            assert.throws(() => parse("* * * * quux1 *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * * quux1 *",
            });
            assert.throws(() => parse("* * * * * corge0"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * * * corge0",
            });
            assert.throws(() => parse("foo0 bar0 baz0 qux1 quux1 corge0"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression:" +
                    " foo0 bar0 baz0 qux1 quux1 corge0",
            });
        });

        it("should reject suffix", function () {
            assert.throws(() => parse("0foo * * * * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: 0foo * * * * *",
            });
            assert.throws(() => parse("* 0bar * * * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * 0bar * * * *",
            });
            assert.throws(() => parse("* * 0baz * * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * 0baz * * *",
            });
            assert.throws(() => parse("* * * 1qux * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * 1qux * *",
            });
            assert.throws(() => parse("* * * * 1quux *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * * 1quux *",
            });
            assert.throws(() => parse("* * * * * 0corge"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * * * 0corge",
            });
            assert.throws(() => parse("0foo 0bar 0baz 1qux 1quux 0corge"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression:" +
                    " 0foo 0bar 0baz 1qux 1quux 0corge",
            });
        });

        it('should support "{min}-{max}"', function () {
            const fields = parse("1-58 2-57 1-22 2-30 2-11 1-6");
            assert.deepEqual(fields.seconds.values(), range(1, 58));
            assert.deepEqual(fields.minutes.values(), range(2, 57));
            assert.deepEqual(fields.hours.values(), range(1, 22));
            assert.deepEqual(fields.date.values(), range(2, 30));
            assert.deepEqual(fields.month.values(), range(1, 10));
            assert.deepEqual(fields.day.values(), [1, 2, 3, 4, 5, 6]);
        });

        it("should support literal month in max", function () {
            const fields = parse("* * * * 6-sep *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [5, 6, 7, 8]);
            assert.ok(!fields.day.restricted);
        });

        it("should support literal uppercase month in max", function () {
            const fields = parse("* * * * 5-OCT *");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [4, 5, 6, 7, 8, 9]);
            assert.ok(!fields.day.restricted);
        });

        it("should reject literal invalid month in max", function () {
            assert.throws(() => parse("* * * * 1-foo *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * * 1-foo *",
            });
        });

        it("should support literal day in max", function () {
            const fields = parse("* * * * * 1-fri");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [1, 2, 3, 4, 5]);
        });

        it("should support literal uppercase day in max", function () {
            const fields = parse("* * * * * 2-THU");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [2, 3, 4]);
        });

        it('should support day "sun" in max', function () {
            const fields = parse("* * * * * 6-SUN");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [0, 6]);
        });

        it("should reject literal invalid day in max", function () {
            assert.throws(() => parse("* * * * * 0-foo"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * * * 0-foo",
            });
        });

        it('should support "?" in min', function () {
            mock.timers.enable({
                apis: ["Date"],
                now: new Date("2000-01-02T03:04:05"),
            });

            const fields = parse("?-5 ?-10 ?-20 ?-30 ?-6 ?-5");
            assert.deepEqual(fields.seconds.values(), [5]);
            assert.deepEqual(fields.minutes.values(), [4, 5, 6, 7, 8, 9, 10]);
            assert.deepEqual(fields.hours.values(), range(3, 20));
            assert.deepEqual(fields.date.values(), range(2, 30));
            assert.deepEqual(fields.month.values(), range(0, 5));
            assert.deepEqual(fields.day.values(), range(0, 5));
        });

        it('should support "?" in max', function () {
            mock.timers.enable({
                apis: ["Date"],
                now: new Date("2000-05-10T20:30:40"),
            });

            const fields = parse("1-? 2-? 3-? 4-? 5-? 0-?");
            assert.deepEqual(fields.seconds.values(), range(1, 40));
            assert.deepEqual(fields.minutes.values(), range(2, 30));
            assert.deepEqual(fields.hours.values(), range(3, 20));
            assert.deepEqual(fields.date.values(), [4, 5, 6, 7, 8, 9, 10]);
            assert.deepEqual(fields.month.values(), [4]);
            assert.deepEqual(fields.day.values(), [0, 1, 2, 3]);
        });

        it('should support "?" in max when it\'s sunday', function () {
            mock.timers.enable({
                apis: ["Date"],
                now: new Date("2000-02-06T00:00:00"),
            });

            const fields = parse("* * * * * 0-?");
            assert.ok(!fields.seconds.restricted);
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [0, 1, 2, 3, 4, 5, 6]);
        });

        it("should reject prefix in max", function () {
            assert.throws(() => parse("0-foo0 * * * * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: 0-foo0 * * * * *",
            });
            assert.throws(() => parse("* 0-bar0 * * * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * 0-bar0 * * * *",
            });
            assert.throws(() => parse("* * 0-baz0 * * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * 0-baz0 * * *",
            });
            assert.throws(() => parse("* * * 1-qux1 * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * 1-qux1 * *",
            });
            assert.throws(() => parse("* * * * 1-quux1 *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * * 1-quux1 *",
            });
            assert.throws(() => parse("* * * * * 0-corge0"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * * * 0-corge0",
            });
            assert.throws(
                () => parse("0-foo0 0-bar0 0-baz0 1-qux1 1-quux1 0-corge0"),
                {
                    name: "Error",
                    message:
                        "Syntax error, unrecognized expression:" +
                        " 0-foo0 0-bar0 0-baz0 1-qux1 1-quux1 0-corge0",
                },
            );
        });

        it("should reject suffix in max", function () {
            assert.throws(() => parse("0-0foo * * * * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: 0-0foo * * * * *",
            });
            assert.throws(() => parse("* 0-0bar * * * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * 0-0bar * * * *",
            });
            assert.throws(() => parse("* * 0-0baz * * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * 0-0baz * * *",
            });
            assert.throws(() => parse("* * * 1-1qux * *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * 1-1qux * *",
            });
            assert.throws(() => parse("* * * * 1-1quux *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * * 1-1quux *",
            });
            assert.throws(() => parse("* * * * * 0-0corge"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * * * 0-0corge",
            });
            assert.throws(
                () => parse("0-0foo 0-0bar 0-0baz 1-1qux 1-1quux 0-0corge"),
                {
                    name: "Error",
                    message:
                        "Syntax error, unrecognized expression:" +
                        " 0-0foo 0-0bar 0-0baz 1-1qux 1-1quux 0-0corge",
                },
            );
        });

        it('should support "{min}-{max}/{step}"', function () {
            const fields = parse("1-5/2 10-20/2 6-12/3 20-30/4 1-11/5 1-7/1");
            assert.deepEqual(fields.seconds.values(), [1, 3, 5]);
            assert.deepEqual(fields.minutes.values(), [10, 12, 14, 16, 18, 20]);
            assert.deepEqual(fields.hours.values(), [6, 9, 12]);
            assert.deepEqual(fields.date.values(), [20, 24, 28]);
            assert.deepEqual(fields.month.values(), [0, 5, 10]);
            assert.deepEqual(fields.day.values(), [0, 1, 2, 3, 4, 5, 6]);
        });

        it("should reject input under limit", function () {
            assert.throws(() => parse("* * * 0 * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * * 0 * *",
            });
            assert.throws(() => parse("* * * * 0 *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * * * 0 *",
            });
            assert.throws(() => parse("* * * 0 0 *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * * 0 0 *",
            });
        });

        it("should reject input over limit", function () {
            assert.throws(() => parse("60 * * * * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: 60 * * * * *",
            });
            assert.throws(() => parse("* 60 * * * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * 60 * * * *",
            });
            assert.throws(() => parse("* * 60 * * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * 60 * * *",
            });
            assert.throws(() => parse("* * * 32 * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * * 32 * *",
            });
            assert.throws(() => parse("* * * * 13 *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * * * 13 *",
            });
            assert.throws(() => parse("* * * * * 8"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * * * * 8",
            });
            assert.throws(() => parse("60 60 60 32 13 8"), {
                name: "RangeError",
                message:
                    "Syntax error, unrecognized expression: 60 60 60 32 13 8",
            });
        });

        it("should reject min over max", function () {
            assert.throws(() => parse("1-0 * * * * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: 1-0 * * * * *",
            });
            assert.throws(() => parse("* 3-2 * * * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * 3-2 * * * *",
            });
            assert.throws(() => parse("* * 5-4 * * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * 5-4 * * *",
            });
            assert.throws(() => parse("* * * 7-6 * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * * 7-6 * *",
            });
            assert.throws(() => parse("* * * * 12-8 *"), {
                name: "RangeError",
                message:
                    "Syntax error, unrecognized expression: * * * * 12-8 *",
            });
            assert.throws(() => parse("* * * * * 7-0"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * * * * 7-0",
            });
            assert.throws(() => parse("1-0 3-2 5-4 7-6 12-8 7-0"), {
                name: "RangeError",
                message:
                    "Syntax error, unrecognized expression:" +
                    " 1-0 3-2 5-4 7-6 12-8 7-0",
            });
        });

        it("should reject step equal zero", function () {
            assert.throws(() => parse("*/0 * * * * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: */0 * * * * *",
            });
            assert.throws(() => parse("* */0 * * * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * */0 * * * *",
            });
            assert.throws(() => parse("* * */0 * * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * */0 * * *",
            });
            assert.throws(() => parse("* * * */0 * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * * */0 * *",
            });
            assert.throws(() => parse("* * * * */0 *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * * * */0 *",
            });
            assert.throws(() => parse("* * * * * */0"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * * * * */0",
            });
            assert.throws(() => parse("*/0 */0 */0 */0 */0 */0"), {
                name: "RangeError",
                message:
                    "Syntax error, unrecognized expression:" +
                    " */0 */0 */0 */0 */0 */0",
            });
        });

        it('should support "~"', function () {
            let times = 0;
            const random = mock.method(Math, "random", () => {
                // prettier-ignore
                switch (times++) {
                    case 0: return 0;
                    case 1: return 0.99;
                    case 2: return 0.5;
                    case 3: return 0.25;
                    case 4: return 0.75;
                    case 5: return 0.33;
                    default: return undefined;
                }
            });

            const fields = parse("~ ~ ~ ~ ~ ~");
            assert.deepEqual(fields.seconds.values(), [0]);
            assert.deepEqual(fields.minutes.values(), [59]);
            assert.deepEqual(fields.hours.values(), [12]);
            assert.deepEqual(fields.date.values(), [8]);
            assert.deepEqual(fields.month.values(), [9]);
            assert.deepEqual(fields.day.values(), [2]);

            assert.equal(random.mock.callCount(), 6);
        });

        it('should support "~/{step}"', function () {
            let times = 0;
            const random = mock.method(Math, "random", () => {
                // prettier-ignore
                switch (times++) {
                    case 0: return 0;
                    case 1: return 0.99;
                    case 2: return 0.5;
                    case 3: return 0.25;
                    case 4: return 0.75;
                    case 5: return 0.33;
                    default: return undefined;
                }
            });

            const fields = parse("~/2 ~/3 ~/4 ~/3 ~/5 ~/1");
            assert.deepEqual(fields.seconds.values(), range(0, 58, 2));
            assert.deepEqual(fields.minutes.values(), range(2, 59, 3));
            assert.deepEqual(fields.hours.values(), [2, 6, 10, 14, 18, 22]);
            assert.deepEqual(fields.date.values(), range(1, 31, 3));
            assert.deepEqual(fields.month.values(), [3, 8]);
            assert.deepEqual(fields.day.values(), [0, 1, 2, 3, 4, 5, 6]);

            assert.equal(random.mock.callCount(), 6);
        });

        it('should support "{min}~"', function () {
            let times = 0;
            const random = mock.method(Math, "random", () => {
                // prettier-ignore
                switch (times++) {
                    case 0: return 0;
                    case 1: return 0.99;
                    case 2: return 0.5;
                    case 3: return 0.25;
                    case 4: return 0.75;
                    case 5: return 0.33;
                    default: return undefined;
                }
            });

            const fields = parse("45~ 30~ 12~ 15~ 6~ 4~");
            assert.deepEqual(fields.seconds.values(), [45]);
            assert.deepEqual(fields.minutes.values(), [59]);
            assert.deepEqual(fields.hours.values(), [18]);
            assert.deepEqual(fields.date.values(), [19]);
            assert.deepEqual(fields.month.values(), [10]);
            assert.deepEqual(fields.day.values(), [5]);

            assert.equal(random.mock.callCount(), 6);
        });

        it('should support "{min}~/{step}"', function () {
            let times = 0;
            const random = mock.method(Math, "random", () => {
                // prettier-ignore
                switch (times++) {
                    case 0: return 0;
                    case 1: return 0.99;
                    case 2: return 0.5;
                    case 3: return 0.25;
                    case 4: return 0.75;
                    case 5: return 0.33;
                    default: return undefined;
                }
            });

            const fields = parse("44~/15 29~/10 11~/3 15~/5 6~/2 4~/2");
            assert.deepEqual(fields.seconds.values(), [44, 59]);
            assert.deepEqual(fields.minutes.values(), [38, 48, 58]);
            assert.deepEqual(fields.hours.values(), [12, 15, 18, 21]);
            assert.deepEqual(fields.date.values(), [16, 21, 26, 31]);
            assert.deepEqual(fields.month.values(), [6, 8, 10]);
            assert.deepEqual(fields.day.values(), [4, 6]);

            assert.equal(random.mock.callCount(), 6);
        });

        it('should support "~{max}"', function () {
            let times = 0;
            const random = mock.method(Math, "random", () => {
                // prettier-ignore
                switch (times++) {
                    case 0: return 0;
                    case 1: return 0.99;
                    case 2: return 0.5;
                    case 3: return 0.25;
                    case 4: return 0.75;
                    case 5: return 0.33;
                    default: return undefined;
                }
            });

            const fields = parse("~45 ~10 ~20 ~30 ~10 ~5");
            assert.deepEqual(fields.seconds.values(), [0]);
            assert.deepEqual(fields.minutes.values(), [10]);
            assert.deepEqual(fields.hours.values(), [10]);
            assert.deepEqual(fields.date.values(), [8]);
            assert.deepEqual(fields.month.values(), [7]);
            assert.deepEqual(fields.day.values(), [1]);

            assert.equal(random.mock.callCount(), 6);
        });

        it('should support "~{max}/{step}"', function () {
            let times = 0;
            const random = mock.method(Math, "random", () => {
                // prettier-ignore
                switch (times++) {
                    case 0: return 0;
                    case 1: return 0.99;
                    case 2: return 0.5;
                    case 3: return 0.25;
                    case 4: return 0.75;
                    case 5: return 0.33;
                    default: return undefined;
                }
            });

            const fields = parse("~44/15 ~29/10 ~11/3 ~15/5 ~6/2 ~5/2");
            assert.deepEqual(fields.seconds.values(), [0, 15, 30]);
            assert.deepEqual(fields.minutes.values(), [9, 19, 29]);
            assert.deepEqual(fields.hours.values(), [1, 4, 7, 10]);
            assert.deepEqual(fields.date.values(), [2, 7, 12]);
            assert.deepEqual(fields.month.values(), [1, 3, 5]);
            assert.deepEqual(fields.day.values(), [0, 2, 4]);

            assert.equal(random.mock.callCount(), 6);
        });

        it('should support "{min}~{max}"', function () {
            let times = 0;
            const random = mock.method(Math, "random", () => {
                // prettier-ignore
                switch (times++) {
                    case 0: return 0;
                    case 1: return 0.99;
                    case 2: return 0.5;
                    case 3: return 0.25;
                    case 4: return 0.75;
                    case 5: return 0.33;
                    default: return undefined;
                }
            });

            const fields = parse("10~50 20~40 8~14 10~20 5~8 1~5");
            assert.deepEqual(fields.seconds.values(), [10]);
            assert.deepEqual(fields.minutes.values(), [40]);
            assert.deepEqual(fields.hours.values(), [11]);
            assert.deepEqual(fields.date.values(), [12]);
            assert.deepEqual(fields.month.values(), [7]);
            assert.deepEqual(fields.day.values(), [2]);

            assert.equal(random.mock.callCount(), 6);
        });

        it('should support "{min}~{max}/{step}"', function () {
            let times = 0;
            const random = mock.method(Math, "random", () => {
                // prettier-ignore
                switch (times++) {
                    case 0: return 0;
                    case 1: return 0.99;
                    case 2: return 0.5;
                    case 3: return 0.25;
                    case 4: return 0.75;
                    case 5: return 0.33;
                    default: return undefined;
                }
            });

            const fields = parse("15~45/15 10~30/5 1~13/3 5~15/5 3~6/2 3~7/2");
            assert.deepEqual(fields.seconds.values(), [15, 30, 45]);
            assert.deepEqual(fields.minutes.values(), [14, 19, 24, 29]);
            assert.deepEqual(fields.hours.values(), [2, 5, 8, 11]);
            assert.deepEqual(fields.date.values(), [6, 11]);
            assert.deepEqual(fields.month.values(), [3, 5]);
            assert.deepEqual(fields.day.values(), [0, 3, 5]);

            assert.equal(random.mock.callCount(), 6);
        });

        it("should reject min date over max days in month", function () {
            assert.throws(() => parse("* * * 30 feb *"), {
                name: "RangeError",
                message:
                    "Syntax error, unrecognized expression: * * * 30 feb *",
            });
        });
    });
});
