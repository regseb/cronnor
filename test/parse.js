/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import parse from "../src/parse.js";

/**
 * Génère les valeurs d'un intervalle.
 *
 * @param {number} min    La valeur minimale (incluse) de l'intervalle.
 * @param {number} max    La valeur maximal (incluse) de l'intervalle.
 * @param {number} [step] Le pas entre les valeurs (<code>1></code> par défaut).
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
    describe("parse()", function () {
        it('should support "@yearly"', function () {
            const fields = parse("@yearly");
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [0]);
            assert.deepEqual(fields.date.values(), [1]);
            assert.deepEqual(fields.month.values(), [0]);
            assert.ok(!fields.day.restricted);
        });

        it('should support "@annually"', function () {
            const fields = parse("@annually");
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [0]);
            assert.deepEqual(fields.date.values(), [1]);
            assert.deepEqual(fields.month.values(), [0]);
            assert.ok(!fields.day.restricted);
        });

        it('should support "@monthly"', function () {
            const fields = parse("@monthly");
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [0]);
            assert.deepEqual(fields.date.values(), [1]);
            assert.ok(!fields.month.restricted);
            assert.ok(!fields.day.restricted);
        });

        it('should support "@weekly"', function () {
            const fields = parse("@weekly");
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [0]);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [0]);
        });

        it('should support "@daily"', function () {
            const fields = parse("@daily");
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [0]);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.ok(!fields.day.restricted);
        });

        it('should support "@midnight"', function () {
            const fields = parse("@midnight");
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [0]);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.ok(!fields.day.restricted);
        });

        it('should support "@hourly"', function () {
            const fields = parse("@hourly");
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.ok(!fields.day.restricted);
        });

        it("should support uppercase nicknames", function () {
            const fields = parse("@HOURLY");
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.ok(!fields.day.restricted);
        });

        it("should reject when too many fields", function () {
            assert.throws(() => parse("* * * * * *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * * * * *",
            });
        });

        it("should reject when not enough fields", function () {
            assert.throws(() => parse("* * * *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * * *",
            });
        });

        it("should support many whitespaces", function () {
            const fields = parse("* *  *   *\t\u00A0*");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.ok(!fields.day.restricted);
        });

        it("should reject invalide field", function () {
            assert.throws(() => parse("= * * * *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: = * * * *",
            });

            assert.throws(() => parse("* $ * * *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * $ * * *",
            });

            assert.throws(() => parse("* * ^ * *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * ^ * *",
            });

            assert.throws(() => parse("* * * février *"), {
                name: "Error",
                message:
                    "Syntax error, unrecognized expression: * * * février *",
            });

            assert.throws(() => parse("* * * * #"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * * * #",
            });
        });

        it('should support "*"', function () {
            const fields = parse("* * * * *");
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
            const fields = parse("*/1 */2 */15 */12 */10");
            assert.deepEqual(fields.minutes.values(), range(0, 59));
            assert.deepEqual(fields.hours.values(), range(0, 23, 2));
            assert.deepEqual(fields.date.values(), [1, 16, 31]);
            assert.deepEqual(fields.month.values(), [0]);
            assert.deepEqual(fields.day.values(), [0]);
        });

        it('should reject "*/0"', function () {
            assert.throws(() => parse("*/0 * * * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: */0 * * * *",
            });
            assert.throws(() => parse("* */0 * * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * */0 * * *",
            });
            assert.throws(() => parse("* * */0 * *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * */0 * *",
            });
            assert.throws(() => parse("* * * */0 *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * * */0 *",
            });
            assert.throws(() => parse("* * * * */0"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * * * */0",
            });
            assert.throws(() => parse("*/0 */0 */0 */0 */0"), {
                name: "RangeError",
                message:
                    "Syntax error, unrecognized expression:" +
                    " */0 */0 */0 */0 */0",
            });
        });

        it('should support month "jan"', function () {
            const fields = parse("* * * jan *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [0]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "feb"', function () {
            const fields = parse("* * * feb *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [1]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "mar"', function () {
            const fields = parse("* * * mar *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [2]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "apr"', function () {
            const fields = parse("* * * apr *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [3]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "may"', function () {
            const fields = parse("* * * may *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [4]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "jun"', function () {
            const fields = parse("* * * jun *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [5]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "jul"', function () {
            const fields = parse("* * * jul *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [6]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "aug"', function () {
            const fields = parse("* * * aug *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [7]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "sep"', function () {
            const fields = parse("* * * sep *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [8]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "oct"', function () {
            const fields = parse("* * * oct *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [9]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "nov"', function () {
            const fields = parse("* * * nov *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [10]);
            assert.ok(!fields.day.restricted);
        });

        it('should support month "dec"', function () {
            const fields = parse("* * * dec *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [11]);
            assert.ok(!fields.day.restricted);
        });

        it("should support litteral uppercase month", function () {
            const fields = parse("* * * DEC *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [11]);
            assert.ok(!fields.day.restricted);
        });

        it("should reject litteral invalid month", function () {
            assert.throws(() => parse("* * * foo *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * * foo *",
            });
        });

        it('should support day "sun"', function () {
            const fields = parse("* * * * sun");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [0]);
        });

        it('should support day "mon"', function () {
            const fields = parse("* * * * mon");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [1]);
        });

        it('should support day "tue"', function () {
            const fields = parse("* * * * tue");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [2]);
        });

        it('should support day "wed"', function () {
            const fields = parse("* * * * wed");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [3]);
        });

        it('should support day "thu"', function () {
            const fields = parse("* * * * thu");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [4]);
        });

        it('should support day "fri"', function () {
            const fields = parse("* * * * fri");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [5]);
        });

        it('should support day "sat"', function () {
            const fields = parse("* * * * sat");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [6]);
        });

        it("should support litteral uppercase day", function () {
            const fields = parse("* * * * SAT");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [6]);
        });

        it("should reject litteral invalid day", function () {
            assert.throws(() => parse("* * * * foo"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * * * foo",
            });
        });

        it('should support "{min}"', function () {
            const fields = parse("1 2 3 4 5");
            assert.deepEqual(fields.minutes.values(), [1]);
            assert.deepEqual(fields.hours.values(), [2]);
            assert.deepEqual(fields.date.values(), [3]);
            assert.deepEqual(fields.month.values(), [3]);
            assert.deepEqual(fields.day.values(), [5]);
        });

        it('should support "?"', function () {
            const clock = sinon.useFakeTimers(new Date("2000-01-02T03:04"));

            const fields = parse("? ? ? ? ?");
            assert.deepEqual(fields.minutes.values(), [4]);
            assert.deepEqual(fields.hours.values(), [3]);
            assert.deepEqual(fields.date.values(), [2]);
            assert.deepEqual(fields.month.values(), [0]);
            assert.deepEqual(fields.day.values(), [0]);

            clock.restore();
        });

        it('should support "{min}-{max}"', function () {
            const fields = parse("1-58 1-22 2-30 2-11 1-6");
            assert.deepEqual(fields.minutes.values(), range(1, 58));
            assert.deepEqual(fields.hours.values(), range(1, 22));
            assert.deepEqual(fields.date.values(), range(2, 30));
            assert.deepEqual(fields.month.values(), range(1, 10));
            assert.deepEqual(fields.day.values(), [1, 2, 3, 4, 5, 6]);
        });

        it("should support litteral month in max", function () {
            const fields = parse("* * * 6-sep *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [5, 6, 7, 8]);
            assert.ok(!fields.day.restricted);
        });

        it("should support litteral uppercase month in max", function () {
            const fields = parse("* * * 5-OCT *");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.deepEqual(fields.month.values(), [4, 5, 6, 7, 8, 9]);
            assert.ok(!fields.day.restricted);
        });

        it("should reject litteral invalid month in max", function () {
            assert.throws(() => parse("* * * 1-foo *"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * * 1-foo *",
            });
        });

        it("should support litteral day in max", function () {
            const fields = parse("* * * * 1-fri");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [1, 2, 3, 4, 5]);
        });

        it("should support litteral uppercase day in max", function () {
            const fields = parse("* * * * 2-THU");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [2, 3, 4]);
        });

        it('should support day "sun" in max', function () {
            const fields = parse("* * * * 6-SUN");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [0, 6]);
        });

        it("should reject litteral invalid day in max", function () {
            assert.throws(() => parse("* * * * 0-foo"), {
                name: "Error",
                message: "Syntax error, unrecognized expression: * * * * 0-foo",
            });
        });

        it('should support "?" in min', function () {
            const clock = sinon.useFakeTimers(new Date("2000-01-02T03:04"));

            const fields = parse("?-10 ?-20 ?-30 ?-6 ?-5");
            assert.deepEqual(fields.minutes.values(), [4, 5, 6, 7, 8, 9, 10]);
            assert.deepEqual(fields.hours.values(), range(3, 20));
            assert.deepEqual(fields.date.values(), range(2, 30));
            assert.deepEqual(fields.month.values(), range(0, 5));
            assert.deepEqual(fields.day.values(), range(0, 5));

            clock.restore();
        });

        it('should support "?" in max', function () {
            const clock = sinon.useFakeTimers(new Date("2000-05-10T20:30"));

            const fields = parse("1-? 2-? 3-? 4-? 0-?");
            assert.deepEqual(fields.minutes.values(), range(1, 30));
            assert.deepEqual(fields.hours.values(), range(2, 20));
            assert.deepEqual(fields.date.values(), [3, 4, 5, 6, 7, 8, 9, 10]);
            assert.deepEqual(fields.month.values(), [3, 4]);
            assert.deepEqual(fields.day.values(), [0, 1, 2, 3]);

            clock.restore();
        });

        it('should support "?" in max when it\'s sunday', function () {
            const clock = sinon.useFakeTimers(new Date("2000-02-06T00:00"));

            const fields = parse("* * * * 0-?");
            assert.ok(!fields.minutes.restricted);
            assert.ok(!fields.hours.restricted);
            assert.ok(!fields.date.restricted);
            assert.ok(!fields.month.restricted);
            assert.deepEqual(fields.day.values(), [0, 1, 2, 3, 4, 5, 6]);

            clock.restore();
        });

        it('should support "{min}-{max}/{step}"', function () {
            const fields = parse("10-20/2 6-12/3 20-30/4 1-11/5 1-7/1");
            assert.deepEqual(fields.minutes.values(), [10, 12, 14, 16, 18, 20]);
            assert.deepEqual(fields.hours.values(), [6, 9, 12]);
            assert.deepEqual(fields.date.values(), [20, 24, 28]);
            assert.deepEqual(fields.month.values(), [0, 5, 10]);
            assert.deepEqual(fields.day.values(), [0, 1, 2, 3, 4, 5, 6]);
        });

        it('should support "~"', function () {
            // prettier-ignore
            const stub = sinon.stub(Math, "random")
                .onCall(0).returns(0)
                .onCall(1).returns(0.99)
                .onCall(2).returns(0.5)
                .onCall(3).returns(0.25)
                .onCall(4).returns(0.75);

            const fields = parse("~ ~ ~ ~ ~");
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [23]);
            assert.deepEqual(fields.date.values(), [16]);
            assert.deepEqual(fields.month.values(), [3]);
            assert.deepEqual(fields.day.values(), [6]);

            assert.equal(stub.callCount, 5);

            sinon.restore();
        });

        it('should support "~/{step}"', function () {
            // prettier-ignore
            const stub = sinon.stub(Math, "random")
                .onCall(0).returns(0)
                .onCall(1).returns(0.99)
                .onCall(2).returns(0.5)
                .onCall(3).returns(0.25)
                .onCall(4).returns(0.75);

            const fields = parse("~/2 ~/4 ~/3 ~/5 ~/1");
            assert.deepEqual(fields.minutes.values(), range(0, 58, 2));
            assert.deepEqual(fields.hours.values(), [3, 7, 11, 15, 19, 23]);
            assert.deepEqual(fields.date.values(), range(2, 29, 3));
            assert.deepEqual(fields.month.values(), [1, 6, 11]);
            assert.deepEqual(fields.day.values(), [0, 1, 2, 3, 4, 5, 6]);

            assert.equal(stub.callCount, 5);

            sinon.restore();
        });

        it('should support "{min}~"', function () {
            // prettier-ignore
            const stub = sinon.stub(Math, "random")
                .onCall(0).returns(0)
                .onCall(1).returns(0.99)
                .onCall(2).returns(0.5)
                .onCall(3).returns(0.25)
                .onCall(4).returns(0.75);

            const fields = parse("30~ 12~ 15~ 6~ 4~");
            assert.deepEqual(fields.minutes.values(), [30]);
            assert.deepEqual(fields.hours.values(), [23]);
            assert.deepEqual(fields.date.values(), [23]);
            assert.deepEqual(fields.month.values(), [6]);
            assert.deepEqual(fields.day.values(), [0]);

            assert.equal(stub.callCount, 5);

            sinon.restore();
        });

        it('should support "{min}~/{step}"', function () {
            // prettier-ignore
            const stub = sinon.stub(Math, "random")
                .onCall(0).returns(0)
                .onCall(1).returns(0.99)
                .onCall(2).returns(0.5)
                .onCall(3).returns(0.25)
                .onCall(4).returns(0.75);

            const fields = parse("30~/10 12~/3 15~/5 6~/2 4~/2");
            assert.deepEqual(fields.minutes.values(), [30, 40, 50]);
            assert.deepEqual(fields.hours.values(), [14, 17, 20, 23]);
            assert.deepEqual(fields.date.values(), [17, 22, 27]);
            assert.deepEqual(fields.month.values(), [5, 7, 9, 11]);
            assert.deepEqual(fields.day.values(), [0, 5]);

            assert.equal(stub.callCount, 5);

            sinon.restore();
        });

        it('should support "~{max}"', function () {
            // prettier-ignore
            const stub = sinon.stub(Math, "random")
                .onCall(0).returns(0)
                .onCall(1).returns(0.99)
                .onCall(2).returns(0.5)
                .onCall(3).returns(0.25)
                .onCall(4).returns(0.75);

            const fields = parse("~10 ~20 ~30 ~10 ~5");
            assert.deepEqual(fields.minutes.values(), [0]);
            assert.deepEqual(fields.hours.values(), [20]);
            assert.deepEqual(fields.date.values(), [16]);
            assert.deepEqual(fields.month.values(), [2]);
            assert.deepEqual(fields.day.values(), [4]);

            assert.equal(stub.callCount, 5);

            sinon.restore();
        });

        it('should support "~{max}/{step}"', function () {
            // prettier-ignore
            const stub = sinon.stub(Math, "random")
                .onCall(0).returns(0)
                .onCall(1).returns(0.99)
                .onCall(2).returns(0.5)
                .onCall(3).returns(0.25)
                .onCall(4).returns(0.75);

            const fields = parse("~30/10 ~12/3 ~15/5 ~6/2 ~4/2");
            assert.deepEqual(fields.minutes.values(), [0, 10, 20, 30]);
            assert.deepEqual(fields.hours.values(), [2, 5, 8, 11]);
            assert.deepEqual(fields.date.values(), [3, 8, 13]);
            assert.deepEqual(fields.month.values(), [0, 2, 4]);
            assert.deepEqual(fields.day.values(), [1, 3]);

            assert.equal(stub.callCount, 5);

            sinon.restore();
        });

        it('should support "{min}~{max}"', function () {
            // prettier-ignore
            const stub = sinon.stub(Math, "random")
                .onCall(0).returns(0)
                .onCall(1).returns(0.99)
                .onCall(2).returns(0.5)
                .onCall(3).returns(0.25)
                .onCall(4).returns(0.75);

            const fields = parse("20~40 8~14 10~20 5~8 1~5");
            assert.deepEqual(fields.minutes.values(), [20]);
            assert.deepEqual(fields.hours.values(), [14]);
            assert.deepEqual(fields.date.values(), [15]);
            assert.deepEqual(fields.month.values(), [5]);
            assert.deepEqual(fields.day.values(), [4]);

            assert.equal(stub.callCount, 5);

            sinon.restore();
        });

        it('should support "{min}~{max}/{step}"', function () {
            // prettier-ignore
            const stub = sinon.stub(Math, "random")
                .onCall(0).returns(0)
                .onCall(1).returns(0.99)
                .onCall(2).returns(0.5)
                .onCall(3).returns(0.25)
                .onCall(4).returns(0.75);

            const fields = parse("10~30/5 1~13/3 5~15/5 3~6/2 3~7/2");
            assert.deepEqual(fields.minutes.values(), [10, 15, 20, 25, 30]);
            assert.deepEqual(fields.hours.values(), [3, 6, 9, 12]);
            assert.deepEqual(fields.date.values(), [7, 12]);
            assert.deepEqual(fields.month.values(), [2, 4]);
            assert.deepEqual(fields.day.values(), [4, 6]);

            assert.equal(stub.callCount, 5);

            sinon.restore();
        });

        it("should reject min date over max days in month", function () {
            assert.throws(() => parse("* * 31 feb *"), {
                name: "RangeError",
                message: "Syntax error, unrecognized expression: * * 31 feb *",
            });
        });
    });
});
